import { useEffect, useState } from 'react';
export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [edittitle, setEditTitle] = useState("");
    const [editdescription, setEditDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const apiUrl = "http://localhost:1000";

    const handleSubmit = () => {
        setError("");
        if (title.trim() === "" || description.trim() === "") {
            setError("Title and description cannot be empty");
            return;
        }
        fetch(apiUrl + '/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error("Unable to create item");
            })
            .then((newItem) => {
                setTodos([...todos, newItem]);
                setMessage("Item added successfully");
                setTitle("");
                setDescription("");
                setTimeout(() => setMessage(""), 3000);
            })
            .catch(() => setError("Unable to create item"));
    };

    useEffect(() => {
        getItem();
    }, []);

    const getItem = () => {
        fetch(apiUrl + '/todo')
            .then((res) => res.json())
            .then((res) => setTodos(res))
            .catch(() => setError("Failed to fetch tasks"));
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (edittitle.trim() === "" || editdescription.trim() === "") {
            setError("Title and description cannot be empty");
            return;
        }
        fetch(apiUrl + '/todo/' + editId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: edittitle, description: editdescription }),
        })
            .then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) => 
                        item._id === editId 
                            ? { ...item, title: edittitle, description: editdescription }
                            : item
                    );
                    setTodos(updatedTodos);
                    setMessage("Item updated successfully");
                    setEditId(-1);
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    throw new Error("Unable to update item");
                }
            })
            .catch(() => setError("Unable to update item"));
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        fetch(apiUrl + '/todo/' + id, {
            method: 'DELETE',
        })
            .then((res) => {
                if (res.ok) {
                    setTodos(todos.filter((item) => item._id !== id));
                    setMessage("Item deleted successfully");
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    throw new Error("Unable to delete item");
                }
            })
            .catch(() => setError("Unable to delete item"));
    };

    return (
        <>
            <div className='row p3 bg-success text-light'>
                <h1>Todo project with MERN</h1>
            </div>
            <div className="row">
                <h3>Add item</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="form-control"
                        type="text"
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className='row mt-3'>
                <h3 className='my-2'>TASKS</h3>
                <ul className='list-group'>
                    {todos.map((item) => (
                        <li key={item._id} className='list-group-item bg-info d-flex justify-content-between align-items-center my-3'>
                            <div className='d-flex flex-column me-2'>
                                {editId !== item._id ? (
                                    <>
                                        <span className='text-light fw-bold'>{item.title}</span>
                                        <span className='text-black'>{item.description}</span>
                                    </>
                                ) : (
                                    <div className="form-group d-flex gap-2">
                                        <input
                                            placeholder="Title"
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            value={edittitle}
                                            className="form-control"
                                            type="text"
                                        />
                                        <input
                                            placeholder="Description"
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            value={editdescription}
                                            className="form-control"
                                            type="text"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='d-flex gap-3'>
                                {editId !== item._id ? (
                                    <>
                                        <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button>
                                    </>
                                ) : (
                                    <>
                                        <button className='btn btn-success' onClick={handleUpdate}>Update</button>
                                        <button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

