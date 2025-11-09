'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './editProfile.module.css'; 

// --- CONSTANTES CONFIGURADAS ---
const API_URL = 'http://localhost:8080';
const CURRENT_USER_ID = 1;
// -----------------------------

type User = {
    id: number;
    name: string;
    email: string;
    profilePictureUrl: string; 
};

export default function EditProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get<User>(`${API_URL}/api/profile/${CURRENT_USER_ID}`); 
                
                setName(response.data.name);
                setEmail(response.data.email);
                
                if (response.data.profilePictureUrl) {
                    setPreviewImage(API_URL + response.data.profilePictureUrl);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                setMessage('Erro ao carregar dados do usuário.'); 
            }
        };
        fetchUserData();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        const formData = new FormData();

        const profileData = { name, email };
        formData.append(
            'profileData',
            new Blob([JSON.stringify(profileData)], { type: 'application/json' })
        );

        if (selectedFile) {
            formData.append('profileImage', selectedFile);
        }

        try {
            const response = await axios.put(
                `${API_URL}/api/profile/${CURRENT_USER_ID}`, 
                formData
            );

            setMessage('✅ Perfil atualizado com sucesso!');
            
            if (response.data.profilePictureUrl) {
                setPreviewImage(API_URL + response.data.profilePictureUrl);
            }
            setSelectedFile(null);

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            setMessage('❌ Erro ao atualizar perfil. Verifique o console.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        
        <div className={styles.container}>
            <div className={styles.card}>
                
                <div className={styles.header}>
                    <h2 className={styles.title}>Editar Perfil</h2>
                    <p style={{ color: '#777', fontSize: '0.95rem' }}>Atualize as informações da sua conta e foto de perfil.</p>
                </div>
                
                <div className={styles.userSummary}>
                    {previewImage ? (
                        <img 
                            src={previewImage} 
                            alt="Foto de Perfil" 
                            className={styles.profileImage} 
                        />
                    ) : (
                        <div className={styles.noPhotoImage}>
                            Sem Foto
                        </div>
                    )}
                    <div>
                        
                        <p style={{ fontWeight: 600 }}>{name || "Usuário"}</p>
                        <p style={{ fontSize: '0.9rem', color: '#777' }}>{email || "usuario@exemplo.com"}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="profileImage">Mudar foto:</label>
                        <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {selectedFile && <span style={{ fontSize: '0.85rem', color: '#008000' }}>Arquivo selecionado: {selectedFile.name}</span>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {message && (
                        <p className={`${styles.message} ${message.startsWith('✅') ? styles.success : styles.error}`}>
                            {message}
                        </p>
                    )}

                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? '💾 Salvando...' : 'Salvar Alterações'}
                    </button>
                </form>
            </div>
        </div>
    );
}