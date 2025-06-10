import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LogoutButton = ({ className = '', children = '로그아웃' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            setIsLoading(true);
            try {
                await logout();
                navigate('/login', { replace: true });
            } catch (error) {
                console.error('로그아웃 오류:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`logout-btn ${className}`}
        >
            {isLoading ? '로그아웃 중...' : children}
        </button>
    );
};

// 사용자 정보와 함께 표시하는 컴포넌트
export const UserProfile = ({ className = '' }) => {
    const { user } = useAuth();

    return (
        <div className={`user-profile ${className}`}>
            <span className="user-name">
                {user?.username || user?.userId}님
            </span>
            <LogoutButton />
        </div>
    );
};

export default LogoutButton;