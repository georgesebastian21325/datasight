import NavigationBar from '../../components/global/NavigationBar'
import ServiceDashboard from '../../../vcomponents/dashboard-ui/service-dashboard'

export default function page() {
    return (
        <div className="flex flex-col h-screen ">
            <NavigationBar />
            <ServiceDashboard />
        </div>
    )
}