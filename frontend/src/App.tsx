import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
import QuizFemale from './pages/QuizFemale'
import QuizMale from './pages/QuizMale'
import Result from './pages/Result'
import Invite from './pages/Invite'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import Header from './components/Header'
import { AuthProvider } from './contexts/AuthContext'
import apiClient from './api/client'
import './App.css'

const SlugValidator: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [isValidSlug, setIsValidSlug] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const validateSlug = async () => {
      if (!slug) {
        setIsLoading(false)
        return
      }

      try {
        const response = await apiClient.get(`/tenants/validate/${slug}`)
        setIsValidSlug(response.data.valid)
        if (!response.data.valid) {
          navigate('/404')
        }
      } catch (error) {
        console.error('Error validating slug:', error)
        navigate('/404')
      } finally {
        setIsLoading(false)
      }
    }

    validateSlug()
  }, [slug, navigate, location.pathname])

  if (isLoading) {
    return <div className="loading-container">Loading...</div>
  }

  if (!slug || !isValidSlug) {
    return <NotFound />
  }

  return <Outlet />
}

const TopPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  return (
    <div className="font-['Noto_Sans_JP',sans-serif] bg-[#f0f7f7] text-[#333] m-0 p-0 leading-relaxed min-h-screen">
      <Header />
      <div className="top-page-container">
        <div className="top-page-card">
          <h1 className="top-page-title">あなたの恋愛タイプ診断</h1>

          <p className="top-page-description">
            あなたの恋愛タイプを診断して、
            <br />
            理想の出会いを見つけましょう！
          </p>

          <div className="button-container">
            <button
              onClick={() => navigate(`/${slug}/quiz-female`)}
              className="gender-button gender-button-female"
            >
              女性
            </button>
            <button
              onClick={() => navigate(`/${slug}/quiz-male`)}
              className="gender-button gender-button-male"
            >
              男性
            </button>
          </div>

          <div className="features-section">
            <h2 className="features-title">診断テストの特徴</h2>
            <ul className="features-list">
              <li className="feature-item">
                <span className="feature-check">✓</span>
                所要時間はわずか2分程度
              </li>
              <li className="feature-item">
                <span className="feature-check">✓</span>
                あなたの性格や価値観を3タイプで診断
              </li>
              <li className="feature-item">
                <span className="feature-check">✓</span>
                あなたの恋愛スタイルが明確になります
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/invitation"
            element={<Invite basePath="/invitation" />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/:slug" element={<SlugValidator />}>
            <Route index element={<TopPage />} />
            <Route path="dashboard" element={<Admin />} />
            <Route path="quiz-female" element={<QuizFemale />} />
            <Route path="quiz-male" element={<QuizMale />} />
            <Route path="result" element={<Result />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
