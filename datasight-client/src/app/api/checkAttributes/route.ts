// pages/api/checkAttributes.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import Papa from 'papaparse';
import { promisify } from 'util';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle FormData ourselves
  },
};

// Define required attributes for each dataset
const requiredAttributesByFile: Record<string, string[]> = {
  'backup-and-recovery-systems.csv': [
    'backup_system_id',
    'host_server_id',
    'system_name',
    'manufacturer',
    'model_id',
    'serial_number',
    'used_backup_capacity_GB',
    'backup_capacity_GB',
    'recovery_time_objective_hours',
    'recovery_point_objective_hours',
    'purchase_date',
    'end_of_support_date',
    'end_of_life_date',
    'total_lifespan_years',
    'status',
    'failure_rate_percentage',
    'utilization_rate_percentage',
    'purchase_cost',
    'cost_per_day',
    'cost_per_storage',
    'data_center_id',
  ],
  // Define more datasets as needed
};

interface ValidationResult {
  isValid: boolean;
  missingAttributes?: string[];
}

const parseCsvHeaders = async (filePath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const headers: string[] = [];
    fs.createReadStream(filePath)
      .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, { header: true }))
      .on('headers', (csvHeaders) => {
        resolve(csvHeaders); // Resolve with headers
      })
      .on('error', reject);
  });
};

const validateCsvHeaders = async (filePath: string, datasetName: string): Promise<ValidationResult> => {
  const requiredAttributes = requiredAttributesByFile[datasetName];
  if (!requiredAttributes) throw new Error(`Unknown dataset: ${datasetName}`);

  const headers = await parseCsvHeaders(filePath);
  const missingAttributes = requiredAttributes.filter(attr => !headers.includes(attr));

  return {
    isValid: missingAttributes.length === 0,
    missingAttributes,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new IncomingForm();
  const formParse = promisify(form.parse.bind(form));

  try {
    const { fields, files } = await formParse(req);
    const datasetName = fields.datasetName as string;

    if (!files.file || !datasetName) {
      return res.status(400).json({ error: 'File and dataset name are required' });
    }

    const filePath = (files.file as any).filepath;
    const validationResult = await validateCsvHeaders(filePath, datasetName);

    // Delete the temporary file after reading headers
    fs.unlinkSync(filePath);

    if (!validationResult.isValid) {
      return res.status(400).json({
        error: `Missing required attributes: ${validationResult.missingAttributes?.join(', ')}`,
      });
    }

    res.status(200).json({ message: 'CSV file is valid and contains all required attributes' });
  } catch (error) {
    console.error('Error validating CSV:', error);
    res.status(500).json({ error: 'Failed to validate CSV file' });
  }
}
