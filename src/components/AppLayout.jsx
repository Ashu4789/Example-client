import Header from './Header';
import Footer from './Footer';

function AppLayout({ children, userDetails, onLogout }) {
    return (
        <div className="app-layout">
            <Header userDetails={userDetails} onLogout={onLogout} />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
 
export default AppLayout;