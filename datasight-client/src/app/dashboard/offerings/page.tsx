import NavigationBar from "@/app/components/global/NavigationBar";
import OfferingDashboard from '../../../vcomponents/dashboard-ui/offering-dashboard'

export default function page() {
    return (
        <div className="flex flex-col h-screen ">
            <NavigationBar />
            <OfferingDashboard />
        </div>
    )
}