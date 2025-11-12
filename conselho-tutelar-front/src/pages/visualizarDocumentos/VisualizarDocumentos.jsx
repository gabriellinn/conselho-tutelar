import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { buscarTodosDocumentos } from '../../api/documentos';
import { gerarPDF } from '../../utils/gerarPDF';

function VisualizarDocumentos() {
  const [documentos, setDocumentos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarDocumentos();
  }, []);

  const carregarDocumentos = async () => {
    try {
      setLoading(true);
      const dados = await buscarTodosDocumentos();
      setDocumentos(dados);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar documentos:', err);
      setError('Erro ao carregar documentos. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return 'N/A';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const getTipoBadge = (tipo) => {
    const tipos = {
      'denuncia': { variant: 'danger', label: 'Denúncia' },
      'atendimento': { variant: 'primary', label: 'Atendimento' },
      'notificacao': { variant: 'warning', label: 'Notificação' },
      'termo-medidas-menor': { variant: 'info', label: 'Termo Medidas (Menor)' },
      'termo-medidas-responsavel': { variant: 'success', label: 'Termo Medidas (Responsável)' }
    };
    const tipoInfo = tipos[tipo] || { variant: 'secondary', label: tipo };
    return <Badge bg={tipoInfo.variant}>{tipoInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-3">Carregando documentos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Erro!</Alert.Heading>
          <p>{error}</p>
          <Button onClick={carregarDocumentos} variant="outline-danger">
            Tentar Novamente
          </Button>
        </Alert>
      </Container>
    );
  }

  const todosDocumentos = [
    ...documentos.denuncias.map(d => ({ ...d, id: d.nrDenuncia })),
    ...documentos.atendimentos.map(a => ({ ...a, id: a.idAtendimento })),
    ...documentos.notificacoes.map(n => ({ ...n, id: n.id })),
    ...documentos.termosMedidasMenor.map(t => ({ ...t, id: t.idmedida_aplicada })),
    ...documentos.termosMedidasResponsavel.map(t => ({ ...t, id: t.idmedida_aplicada }))
  ].sort((a, b) => {
    const dataA = a.Data || a.data || new Date(0);
    const dataB = b.Data || b.data || new Date(0);
    return new Date(dataB) - new Date(dataA);
  });

  return (
    <Container className="my-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">
            <i className="bi bi-file-earmark-text me-2"></i>
            Documentos Salvos
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0">
              Total de documentos: <strong>{todosDocumentos.length}</strong>
            </p>
            <Button variant="outline-primary" onClick={carregarDocumentos}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Atualizar
            </Button>
          </div>

          {todosDocumentos.length === 0 ? (
            <Alert variant="info">
              Nenhum documento encontrado. Os documentos aparecerão aqui após serem salvos.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Detalhes</th>
                  </tr>
                </thead>
                <tbody>
                  {todosDocumentos.map((doc, index) => (
                    <tr key={`${doc.tipo}-${doc.id}-${index}`}>
                      <td>{getTipoBadge(doc.tipo)}</td>
                      <td>
                        {doc.nrDenuncia || doc.idAtendimento || doc.id || doc.idmedida_aplicada}
                      </td>
                      <td>
                        {formatarData(doc.Data || doc.data)}
                      </td>
                      <td>
                        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {doc.DescricaoFato || doc.Relato || doc.descricao || doc.recebedor || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => {
                            try {
                              gerarPDF(doc);
                            } catch (error) {
                              console.error('Erro ao gerar PDF:', error);
                              alert('Erro ao gerar PDF. Verifique o console para mais detalhes.');
                            }
                          }}
                        >
                          <i className="bi bi-file-earmark-pdf me-1"></i>
                          Gerar PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="mt-4">
            <h5>Resumo por Tipo:</h5>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="danger">Denúncias: {documentos.denuncias.length}</Badge>
              <Badge bg="primary">Atendimentos: {documentos.atendimentos.length}</Badge>
              <Badge bg="warning">Notificações: {documentos.notificacoes.length}</Badge>
              <Badge bg="info">Termos Medidas (Menor): {documentos.termosMedidasMenor.length}</Badge>
              <Badge bg="success">Termos Medidas (Responsável): {documentos.termosMedidasResponsavel.length}</Badge>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default VisualizarDocumentos;

