import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../services/api';

function GerenciamentoUsers() {
    useEffect(() => {
        getUsers();
        document.body.classList.add('bg-light', 'text-light', 'text-center', 'p-3');

        return () => {
            document.body.classList.remove('bg-light', 'text-dark');
            document.body.style = '';
        };
    }, []);

    const [users, setUsers] = useState([])
    const [editUser, setEditUser] = useState(null);

    async function getUsers() {

        const usersFromAPI = await api.get('/user')

        setUsers(usersFromAPI.data)
    }

    async function deleteUser(Id) {
        try {
            await api.delete(`user/${Id}`)
            setUsers(users.filter(user => user._id !== Id));
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
        }
    }

    async function updateUser() {
        if (!editUser) return;

        try {
            await api.put(`/user/${editUser._id}`, {
                name: editUser.name,
                email: editUser.email,
                password: editUser.password,
            });
    
            // Atualizar a lista de usuários com os dados editados
            setUsers(users.map(user =>
                user._id === editUser._id ? editUser : user
            ));
    
            setEditUser(null);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error.response?.data || error.message);
        }
    }

    function logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return (
        <>
            <header className="bg-primary py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="h3 mb-0">Controle seu Tempo</h1>
                    <nav>
                        <button className="btn btn-link text-light">Gerenciar usuários</button>
                        <button onClick={ logout } className="btn btn-link text-light">Sair</button>
                    </nav>
                </div>
            </header>

            <div className="d-flex justify-content-center mt-3">
                <table className="table table-striped">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>

                    <tbody>

                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button onClick={() => setEditUser(user)}
                                            className="btn btn-sm btn-warning mx-1">Editar</button>
                                        <button onClick={() => deleteUser(user._id)}
                                            className="btn btn-sm btn-danger">Excluir</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    Nenhum usuário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editUser && (
                <div className="modal d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-dark">Editar Usuário</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setEditUser(null)} 
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editUser.name || ""}
                                            onChange={e =>
                                                setEditUser({ ...editUser, name: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">E-mail</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={editUser.email || ""}
                                            onChange={e =>
                                                setEditUser({ ...editUser, email: e.target.value })
                                            }
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditUser(null)} 
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={updateUser}
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default GerenciamentoUsers;