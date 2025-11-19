// src/components/Mapa.jsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { buscarMarcadores } from '../../api/marcadores';

// CSS da Leaflet
import 'leaflet/dist/leaflet.css'; 

// Nosso CSS customizado para o layout de página inteira
import './mapa.css';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Mapa = () => {
    // As coordenadas de Panambi continuam no centro
    const position = [-28.2916, -53.5014];
    const [marcadores, setMarcadores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarMarcadores();
    }, []);

    const carregarMarcadores = async () => {
        try {
            setLoading(true);
            console.log('[MAPA] Carregando marcadores...');
            const dados = await buscarMarcadores();
            console.log('[MAPA] Marcadores carregados:', dados);
            console.log('[MAPA] Total de marcadores:', dados.length);
            setMarcadores(dados);
        } catch (error) {
            console.error('[MAPA] Erro ao carregar marcadores:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTipoLabel = (tipo) => {
        const tipos = {
            'denuncia': 'Denúncia',
            'atendimento': 'Atendimento',
            'notificacao': 'Notificação',
            'termo-medidas-menor': 'Termo Medidas (Menor)',
            'termo-medidas-responsavel': 'Termo Medidas (Responsável)'
        };
        return tipos[tipo] || tipo || 'Documento';
    };

    return (
        // Este div é o nosso contêiner de página inteira
        <div className="map-wrapper"> 
            <MapContainer 
                center={position} 
                zoom={13} 
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Marcador fixo do Conselho Tutelar */}
                <Marker position={position}>
                    <Popup>
                        <strong>Conselho Tutelar</strong><br />
                        Rua Hermann Mayer, 43, Térreo<br />
                        Centro, Panambi/RS
                    </Popup>
                </Marker>

                {/* Marcadores dos documentos */}
                {!loading && marcadores.length > 0 && (
                    <>
                        {console.log('[MAPA] Renderizando marcadores:', marcadores)}
                        {marcadores.map((marcador) => {
                            console.log('[MAPA] Renderizando marcador:', marcador);
                            if (!marcador.latitude || !marcador.longitude) {
                                console.warn('[MAPA] Marcador sem coordenadas:', marcador);
                                return null;
                            }
                            return (
                                <Marker 
                                    key={marcador.idMarcador} 
                                    position={[parseFloat(marcador.latitude), parseFloat(marcador.longitude)]}
                                >
                                    <Popup>
                                        <strong>{getTipoLabel(marcador.tipoDocumento)}</strong>
                                        {marcador.idDocumento && <><br />ID: {marcador.idDocumento}</>}
                                        <br />
                                        <strong>Endereço:</strong> {marcador.endereco}
                                        {marcador.descricao && (
                                            <>
                                                <br />
                                                <strong>Descrição:</strong> {marcador.descricao}
                                            </>
                                        )}
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </>
                )}
                {!loading && marcadores.length === 0 && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '10px', zIndex: 1000, borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                        Nenhum marcador encontrado. Verifique o console do servidor para logs de geocodificação.
                    </div>
                )}
            </MapContainer>
        </div>
    );
};

export default Mapa;