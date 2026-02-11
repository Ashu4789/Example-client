import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

const CreateExpenseModal = ({ show, onHide, groupId, groupMembers, onSuccess }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paidBy, setPaidBy] = useState('');
    const [splitType, setSplitType] = useState('equal'); // equal, unequal
    const [splits, setSplits] = useState([]);
    const [includedUsers, setIncludedUsers] = useState([]); // Array of emails
    const [error, setError] = useState('');

    useEffect(() => {
        if (show && groupMembers.length > 0) {
            // Default payer to first member or current user if available
            if (!paidBy) setPaidBy(groupMembers[0]);

            // Initialize included users (all by default)
            setIncludedUsers(groupMembers);

            // Initialize splits
            const initialAmount = amount ? parseFloat(amount) / groupMembers.length : 0;
            setSplits(groupMembers.map(email => ({ email, amount: initialAmount })));
        }
    }, [show, groupMembers]);

    // Update splits when amount, splitType, or includedUsers changes
    useEffect(() => {
        if (amount && includedUsers.length > 0) {
            if (splitType === 'equal') {
                const splitAmount = parseFloat(amount) / includedUsers.length;
                setSplits(groupMembers.map(email => ({
                    email,
                    amount: includedUsers.includes(email) ? splitAmount : 0
                })));
            } else {
                // For unequal, ensures excluded users have 0
                setSplits(prev => prev.map(s => ({
                    ...s,
                    amount: includedUsers.includes(s.email) ? s.amount : 0
                })));
            }
        } else if (amount && includedUsers.length === 0) {
            setSplits(groupMembers.map(email => ({ email, amount: 0 })));
        }
    }, [amount, splitType, includedUsers, groupMembers]);

    const handleSplitChange = (email, value) => {
        const newAmount = parseFloat(value) || 0;
        setSplits(prev => prev.map(s => s.email === email ? { ...s, amount: newAmount } : s));
    };

    const handleToggleInclusion = (email) => {
        setIncludedUsers(prev => {
            if (prev.includes(email)) {
                return prev.filter(e => e !== email);
            } else {
                return [...prev, email];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!description || !amount || !paidBy) {
            setError('Please fill in all required fields.');
            return;
        }

        if (includedUsers.length === 0) {
            setError('At least one member must be included in the split.');
            return;
        }

        const totalSplit = splits.reduce((acc, curr) => acc + curr.amount, 0);
        if (Math.abs(totalSplit - parseFloat(amount)) > 0.1) { // Allow small float diff
            setError(`Split amounts (${totalSplit.toFixed(2)}) must match total amount (${parseFloat(amount).toFixed(2)})`);
            return;
        }

        // Filter out splits with 0 amount -> Actually, wait. The server logic:
        // "Verify split sum matches total amount". If I exclude users (0 amount), the sum should still match total.
        // And stored splits should likely only contain those who owe money.
        // Let's filter out users with 0 amount to keep DB clean.
        const finalSplits = splits.filter(s => s.amount > 0);

        try {
            await axios.post(`${serverEndpoint}/expenses/add`, {
                description,
                amount: parseFloat(amount),
                groupId,
                paidBy,
                splits: finalSplits
            }, { withCredentials: true });

            onSuccess();
            onHide();
            // Reset form
            setDescription('');
            setAmount('');
            setSplitType('equal');
            setIncludedUsers(groupMembers); // Reset to all
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to add expense');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="What is this for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>₹</InputGroup.Text>
                            <Form.Control
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Paid By</Form.Label>
                        <Form.Select
                            value={paidBy}
                            onChange={(e) => setPaidBy(e.target.value)}
                        >
                            {groupMembers.map(email => (
                                <option key={email} value={email}>{email}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Split By</Form.Label>
                        <div className="d-flex gap-2 mb-2">
                            <Button
                                variant={splitType === 'equal' ? 'primary' : 'outline-primary'}
                                size="sm"
                                onClick={() => setSplitType('equal')}
                            >
                                Equally
                            </Button>
                            <Button
                                variant={splitType === 'unequal' ? 'primary' : 'outline-primary'}
                                size="sm"
                                onClick={() => setSplitType('unequal')}
                            >
                                Unequally
                            </Button>
                        </div>

                        <div className="bg-light p-3 rounded">
                            {splits.map((split, index) => (
                                <div key={split.email} className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={includedUsers.includes(split.email)}
                                            onChange={() => handleToggleInclusion(split.email)}
                                            id={`check-${split.email}`}
                                        />
                                        <label className="form-check-label small text-truncate" style={{ maxWidth: '150px' }} htmlFor={`check-${split.email}`}>
                                            {split.email}
                                        </label>
                                    </div>
                                    <InputGroup style={{ width: '120px' }} size="sm">
                                        <InputGroup.Text>₹</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            value={split.amount.toFixed(2)}
                                            disabled={splitType === 'equal' || !includedUsers.includes(split.email)}
                                            onChange={(e) => handleSplitChange(split.email, e.target.value)}
                                        />
                                    </InputGroup>
                                </div>
                            ))}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handleSubmit}>Add Expense</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateExpenseModal;
