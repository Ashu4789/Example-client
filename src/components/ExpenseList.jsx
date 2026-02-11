import React from 'react';

const ExpenseList = ({ expenses }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">Recent Activity</h5>

                {expenses.length === 0 ? (
                    <p className="text-muted text-center my-3">No activity yet.</p>
                ) : (
                    <div className="list-group list-group-flush">
                        {expenses.map(expense => (
                            <div key={expense._id} className="list-group-item px-0 py-3">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex">
                                        <div className="bg-light rounded p-2 me-3 text-center" style={{ width: '50px' }}>
                                            <small className="d-block text-uppercase fw-bold text-muted" style={{ fontSize: '0.7rem' }}>
                                                {new Date(expense.date).toLocaleString('default', { month: 'short' })}
                                            </small>
                                            <span className="fw-bold h5 mb-0 d-block">
                                                {new Date(expense.date).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">{expense.description}</h6>
                                            <small className="text-muted">
                                                <span className="fw-medium text-dark">{expense.paidBy}</span> paid
                                                <span className="fw-bold ms-1">₹{expense.amount}</span>
                                            </small>
                                            {expense.isSettled && (
                                                <span className="badge bg-secondary ms-2" style={{ fontSize: '0.65rem' }}>SETTLED</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>You borrowed</small>
                                        {/* TODO: Calculate "You borrowed" dynamically based on logged in user logic if time permits */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseList;
