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
    const [error, setError] = useState('');

    useEffect(() => {
        if (show && groupMembers.length > 0) {
            // Default payer to first member or current user if available
            // For now, simple default
            if (!paidBy) setPaidBy(groupMembers[0]);

            // Initialize splits
            const initialAmount = amount ? parseFloat(amount) / groupMembers.length : 0;
            setSplits(groupMembers.map(email => ({ email, amount: initialAmount })));
        }
    }, [show, groupMembers]);

    // Update splits when total amount changes or split type changes
    useEffect(() => {
        if (splitType === 'equal' && amount) {
            const splitAmount = parseFloat(amount) / groupMembers.length;
            setSplits(groupMembers.map(email => ({ email, amount: splitAmount })));
        }
    }, [amount, splitType, groupMembers]);

    const handleSplitChange = (email, value) => {
        const newAmount = parseFloat(value) || 0;
        setSplits(prev => prev.map(s => s.email === email ? { ...s, amount: newAmount } : s));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!description || !amount || !paidBy) {
            setError('Please fill in all required fields.');
            return;
        }

        const totalSplit = splits.reduce((acc, curr) => acc + curr.amount, 0);
        if (Math.abs(totalSplit - parseFloat(amount)) > 0.1) { // Allow small float diff
            setError(`Split amounts (${totalSplit}) must match total amount (${amount})`);
            return;
        }

        try {
            await axios.post(`${serverEndpoint}/expenses/add`, {
                description,
                amount: parseFloat(amount),
                groupId,
                paidBy,
                splits
            }, { withCredentials: true });

            onSuccess();
            onHide();
            // Reset form
            setDescription('');
            setAmount('');
            setSplitType('equal');
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
                                    <span className="small text-truncate" style={{ maxWidth: '150px' }}>{split.email}</span>
                                    <InputGroup style={{ width: '120px' }} size="sm">
                                        <InputGroup.Text>₹</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            value={splitType === 'equal' ? split.amount.toFixed(2) : split.amount}
                                            disabled={splitType === 'equal'}
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
