import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 역할별 기본 페이지 반환 - 명확하게 구분
    const getDefaultPageForRole = (userRole) => {
        console.log('역할별 기본 페이지 확인:', userRole); // 디버깅용

        switch (userRole) {
            case '관리자':
                return '/admin';
            case '의사':
                return '/';
            case '간호사':
                return '/';
            default:
                return '/'; // 기본값은 메인 페이지
        }
    };

    // 세션 상태 확인 - 자동 리다이렉트 방지
    const checkAuthStatus = async (preventRedirect = false) => {
        try {
            console.log('인증 상태 확인 중... preventRedirect:', preventRedirect);
            const response = await fetch('http://localhost:8081/api/auth/status', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('상태 확인 응답:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('상태 확인 결과:', result);

                if (result.authenticated) {
                    const defaultPage = getDefaultPageForRole(result.userRole);
                    console.log('계산된 기본 페이지:', defaultPage, '역할:', result.userRole); // 디버깅용

                    const userData = {
                        userId: result.username,
                        username: result.username,
                        userName: result.userName,
                        userRole: result.userRole,
                        authorities: result.authorities,
                        defaultPage: defaultPage
                    };

                    // 기존 유저 정보와 비교하여 변경된 경우에만 업데이트
                    if (!user || user.userId !== userData.userId || user.userRole !== userData.userRole) {
                        setUser(userData);
                    }
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                console.log('인증 상태 확인 실패:', response.status);
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            if (!preventRedirect) {
                setIsLoading(false);
            }
        }
    };

    // 로그인
    const login = async (userId, password) => {
        try {
            console.log('로그인 시도:', userId);

            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ userId, password })
            });

            console.log('로그인 응답 상태:', response.status);
            const result = await response.json();
            console.log('로그인 응답 데이터:', result);

            if (response.ok) {
                const defaultPage = getDefaultPageForRole(result.userRole);
                console.log('로그인 시 계산된 기본 페이지:', defaultPage, '역할:', result.userRole); // 디버깅용

                // Spring 컨트롤러에서 반환하는 구조에 맞게 수정
                const userData = {
                    userId: result.username,
                    username: result.username,
                    userName: result.userName,
                    userRole: result.userRole,
                    authorities: result.authorities,
                    defaultPage: defaultPage
                };

                setUser(userData);
                setIsAuthenticated(true);
                return { success: true, user: userData };
            } else {
                return { success: false, message: result.message || '로그인에 실패했습니다.' };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, message: '네트워크 오류가 발생했습니다. 서버 연결을 확인해주세요.' };
        }
    };

    // 로그아웃
    const logout = async () => {
        try {
            console.log('로그아웃 시도');

            await fetch('http://localhost:8081/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('로그아웃 완료');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // 페이지 로드 시 세션 확인
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // 페이지 가시성 변경 시 세션 재확인 - 자동 리다이렉트 방지
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && isAuthenticated) {
                // preventRedirect를 true로 설정하여 자동 리다이렉트 방지
                checkAuthStatus(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAuthenticated]);

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        checkAuthStatus,
        getDefaultPageForRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};