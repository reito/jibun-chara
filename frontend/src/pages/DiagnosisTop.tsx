import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f0f7f7;
`

const ContentWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(106, 193, 208, 0.1);
  text-align: center;
`

const Title = styled.h1`
  color: #5fb5d0;
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: 700;
`

const Description = styled.p`
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
  line-height: 1.8;
`

const GenderSelection = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }
`

const GenderButton = styled.button<{ gender: 'male' | 'female' }>`
  background: #fff;
  border: 2px solid
    ${(props) => (props.gender === 'female' ? '#ff85a2' : '#4a90e2')};
  color: ${(props) => (props.gender === 'female' ? '#ff85a2' : '#4a90e2')};
  padding: 20px 40px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 200px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(95, 181, 208, 0.2);
    background: ${(props) =>
      props.gender === 'female' ? '#fff5f7' : '#f5f8fc'};
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
    pointer-events: none;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 250px;
    padding: 15px 30px;
    font-size: 16px;
  }
`

const Features = styled.div`
  margin-top: 40px;
  padding: 20px;
  background: rgba(106, 193, 208, 0.05);
  border-radius: 10px;

  @media (max-width: 480px) {
    margin-top: 30px;
    padding: 15px;
  }
`

const FeaturesTitle = styled.h2`
  color: #5fb5d0;
  font-size: 18px;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
`

const FeatureItem = styled.li`
  margin-bottom: 10px;
  padding-left: 25px;
  position: relative;
  color: #456;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #5fb5d0;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`

const DiagnosisTop = () => {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('DiagnosisTop mounted')
  }, [])

  const handleGenderSelect = (gender: 'male' | 'female') => {
    console.log('Gender selected:', gender)
    navigate(`/diagnosis/${gender}`)
  }

  console.log('DiagnosisTop rendering')
  return (
    <Container>
      <ContentWrapper>
        <Title>じぶんキャラ診断</Title>
        <Description>
          あなたの性格や価値観から、最も当てはまるキャラを診断します。
          <br />
          45の質問であなたがどのキャラに当てはまるのか分かります。
        </Description>

        <GenderSelection>
          <GenderButton
            gender="female"
            onClick={() => handleGenderSelect('female')}
          >
            女性
          </GenderButton>
          <GenderButton
            gender="male"
            onClick={() => handleGenderSelect('male')}
          >
            男性
          </GenderButton>
        </GenderSelection>

        <Features>
          <FeaturesTitle>診断テストの特徴</FeaturesTitle>
          <FeaturesList>
            <FeatureItem>所要時間はわずか2分程度</FeatureItem>
            <FeatureItem>あなたの性格や価値観を3タイプで診断</FeatureItem>
            <FeatureItem>あなたの恋愛スタイルが明確になります</FeatureItem>
          </FeaturesList>
        </Features>
      </ContentWrapper>
    </Container>
  )
}

export default DiagnosisTop
