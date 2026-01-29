import Header from './Header';
import Footer from './Footer';

function AppLayout({ children }) {
    return (
        <div className="app-layout">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
 
export default AppLayout;