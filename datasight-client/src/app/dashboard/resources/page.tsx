import ResourceDashboard from '../../../vcomponents/dashboard-ui/resource-dashboard'
import NavigationBar from '../../components/global/NavigationBar'

export default function page() {
    return (
        <div className="flex flex-col h-screen ">
            <NavigationBar />
            <ResourceDashboard />        
        </div>
    )
}