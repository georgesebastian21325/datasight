import ProductDashboard from '../../../vcomponents/dashboard-ui/product-dashboard'
import NavigationBar from '../../components/global/NavigationBar'


export default function page() {
    return (
        <div className="flex flex-col h-screen ">
            <NavigationBar />
            <ProductDashboard />
        </div>
    )
}