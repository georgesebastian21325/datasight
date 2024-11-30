export type Resource = {
  service_id: string;
  resource_id: string;
  period: string;
  predicted_usage_percentage: number;
  current_status: string;
  distributed_utilization_percentage: number;
  optimized_status: string;
};

