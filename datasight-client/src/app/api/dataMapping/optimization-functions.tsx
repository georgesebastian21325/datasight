async function fetchRiskOptimizationTable() {
 type RiskOptimizationTableItems = {
  service_id: string;
  resource_id: string;
  period: string;
  predicted_usage_percentage: string;
  current_status: string;
  distributed_utilization_percentage: string;
  optimized_status: string;
 };

 try {
  const response = await fetch(
   'https://d9b890dlsg.execute-api.ap-southeast-2.amazonaws.com/development/getRiskOptimizedTable'
  );
  if (!response.ok) throw new Error(`Error: ${response.statusText}`);

  const data = await response.json();
  const bodyData: RiskOptimizationTableItems[] = JSON.parse(data.body);

  // Format the fetched data
  const formattedData = bodyData.map((item) => ({
   ...item,
   predicted_usage_percentage: parseFloat(item.predicted_usage_percentage),
   distributed_utilization_percentage: parseFloat(item.distributed_utilization_percentage),
  }));

  return formattedData;
 } catch (error) {
  console.error('Fetch Error:', error);
  return [];
 }
}
