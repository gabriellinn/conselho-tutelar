import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Componente para proteger rotas que requerem cargo de secretário ou admin
 * @param {Object} props - Props do componente
 * @param {React.ReactNode} props.children - Componentes filhos a serem renderizados
 * @returns {React.ReactNode} - Componente protegido ou redirecionamento
 */
function ProtectedRoute({ children }) {
    // Obter informações do usuário do localStorage
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) {
        // Se não houver informações do usuário, redirecionar para login
        return <Navigate to="/" replace />;
    }

    try {
        const user = JSON.parse(userInfo);
        const cargo = user.cargo;

        // Verificar se o usuário tem cargo de secretário ou admin
        // Admin tem acesso total a todas as páginas
        if (cargo !== 'secretario' && cargo !== 'admin') {
            // Se não for secretário nem admin, mostrar mensagem de acesso negado
            return (
                <Container className="my-5">
                    <Alert variant="danger" className="text-center">
                        <Alert.Heading>Acesso Negado</Alert.Heading>
                        <p>
                            Esta página é restrita apenas para usuários com cargo de Secretário/a ou Administrador.
                        </p>
                        <p className="mb-0">
                            <Link to="/home" className="alert-link">Voltar para a página inicial</Link>
                        </p>
                    </Alert>
                </Container>
            );
        }

        // Se for secretário ou admin, renderizar os componentes filhos
        return children;
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        return <Navigate to="/" replace />;
    }
}

export default ProtectedRoute;

