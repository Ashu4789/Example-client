import React from 'react';
import { GroupRoleGate } from '../rbac/GroupRoleGate';

const ExpenseSummary = ({ summary, onSettle, group }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(Math.abs(amount));
    };

    return (
        <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title fw-bold mb-0">Expense Summary</h5>
                    {Object.values(summary).some(val => val !== 0) && (
                        <GroupRoleGate group={group} allowedRoles={['admin', 'manager']}>
                            <button
                                className="btn btn-primary btn-sm rounded-pill px-3"
                                onClick={onSettle}
                            >
                                Settle Up
                            </button>
                        </GroupRoleGate>
                    )}
                </div>

                {Object.keys(summary).length === 0 ? (
                    <p className="text-muted text-center my-3">No expenses to show.</p>
                ) : (
                    <div className="list-group list-group-flush">
                        {Object.entries(summary).map(([email, amount]) => (
                            <div key={email} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                                <div className="d-flex align-items-center">
                                    <div className="avatar me-3 bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                        <i className="bi bi-person text-secondary"></i>
                                    </div>
                                    <span className="fw-medium">{email}</span>
                                </div>
                                <div className={`fw-bold ${amount > 0 ? 'text-success' : amount < 0 ? 'text-danger' : 'text-muted'}`}>
                                    {amount > 0 ? 'gets back ' : amount < 0 ? 'owes ' : 'settled'}
                                    {amount !== 0 && formatCurrency(amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseSummary;
