import { useRef, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import ExpenseSummary from "../components/ExpenseSummary";
import CreateExpenseModal from "../components/CreateExpenseModal";
import ExpenseList from "../components/ExpenseList";

function GroupExpenses() {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [settling, setSettling] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch all user groups to find the current one (reusing existing endpoint)
            // Ideally should have a getGroupById endpoint, but this works with existing API
            const groupsRes = await axios.get(`${serverEndpoint}/groups/my-groups`, { withCredentials: true });
            const currentGroup = groupsRes.data.find(g => g._id === groupId);
            setGroup(currentGroup);

            // 2. Fetch Expenses
            const expensesRes = await axios.get(`${serverEndpoint}/expenses/group/${groupId}`, { withCredentials: true });
            setExpenses(expensesRes.data);

            // 3. Fetch Summary
            const summaryRes = await axios.get(`${serverEndpoint}/expenses/group/${groupId}/summary`, { withCredentials: true });
            setSummary(summaryRes.data);

        } catch (error) {
            console.error("Error fetching group data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettleUp = async () => {
        if (!window.confirm("Are you sure you want to settle all debts? This will mark all current expenses as settled.")) return;

        try {
            setSettling(true);
            await axios.post(`${serverEndpoint}/expenses/settle`, { groupId }, { withCredentials: true });
            // Refresh data
            await fetchData();
        } catch (error) {
            console.error("Error settling group:", error);
            alert("Failed to settle group. Please try again.");
        } finally {
            setSettling(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId]);

    if (loading) {
        return (
            <div className="container p-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-grow text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="container py-5 text-center">
                <h2>Group Not Found</h2>
                <Link to="/dashboard" className="btn btn-primary mt-3">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="container py-5 px-4 px-md-5">
            {/* Header & Breadcrumb */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none">Groups</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{group.name}</li>
                    </ol>
                </nav>
                <Link to="/dashboard" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                    <i className="bi bi-arrow-left me-1"></i> Back
                </Link>
            </div>

            <div className="row mb-5">
                <div className="col-lg-8">
                    <h1 className="display-5 fw-bold text-dark mb-2">{group.name}</h1>
                    <p className="text-muted lead mb-4">{group.description || "Manage your shared expenses."}</p>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                        {group.membersEmail.map((email, idx) => (
                            <span key={idx} className="badge bg-light text-dark border fw-normal py-2 px-3 rounded-pill">
                                <i className="bi bi-person me-1 text-secondary"></i> {email}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="col-lg-4 text-lg-end">
                    <button
                        className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm"
                        onClick={() => setShowAddModal(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Add Expense
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column: Summary & Balances */}
                <div className="col-lg-4 order-lg-2">
                    <ExpenseSummary
                        summary={summary}
                        onSettle={handleSettleUp}
                    />
                </div>

                {/* Right Column: Expense List */}
                <div className="col-lg-8 order-lg-1">
                    <ExpenseList expenses={expenses} />
                </div>
            </div>

            {/* Modals */}
            <CreateExpenseModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                groupId={groupId}
                groupMembers={group.membersEmail}
                onSuccess={fetchData}
            />
        </div>
    );
}

export default GroupExpenses;
