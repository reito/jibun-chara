import React, { useEffect, useState } from 'react'
import { useSearchParams, Link, useParams } from 'react-router-dom'

// 画像のインポート
import kingImage from '../assets/img/character-king.png'
import knightImage from '../assets/img/character-knight.png'
import princeImage from '../assets/img/character-prince.png'
import idolImage from '../assets/img/character-idol.png'
import careerImage from '../assets/img/character-career.png'
import motherImage from '../assets/img/character-mother.png'
import kingKnightImage from '../assets/img/character-king-knight.png'
import knightPrinceImage from '../assets/img/character-knight-prince.png'
import kingPrinceImage from '../assets/img/character-king-prince.png'
import idolCareerImage from '../assets/img/character-idol-career.png'
import careerMotherImage from '../assets/img/character-career-mother.png'
import motherIdolImage from '../assets/img/character-mother-idol.png'
import characterBalanceMaleImage from '../assets/img/character-balance-male.png'
import characterBalanceFemaleImage from '../assets/img/character-balance-female.png'

interface CharacterImage {
  image: string
  name: string
}

interface CharacterImages {
  [key: string]:
    | CharacterImage
    | {
        male: CharacterImage
        female: CharacterImage
      }
}

const characterImages: CharacterImages = {
  キングタイプ: {
    image: kingImage,
    name: 'キングタイプ',
  },
  ナイトタイプ: {
    image: knightImage,
    name: 'ナイトタイプ',
  },
  プリンスタイプ: {
    image: princeImage,
    name: 'プリンスタイプ',
  },
  アイドルタイプ: {
    image: idolImage,
    name: 'アイドルタイプ',
  },
  バリキャリタイプ: {
    image: careerImage,
    name: 'バリキャリタイプ',
  },
  マザータイプ: {
    image: motherImage,
    name: 'マザータイプ',
  },
  バランスタイプ: {
    male: {
      image: characterBalanceMaleImage,
      name: 'バランスタイプ（男性）',
    },
    female: {
      image: characterBalanceFemaleImage,
      name: 'バランスタイプ（女性）',
    },
  },
  'キング＆ナイトタイプ': {
    image: kingKnightImage,
    name: 'キング＆ナイトタイプ',
  },
  'ナイト＆プリンスタイプ': {
    image: knightPrinceImage,
    name: 'ナイト＆プリンスタイプ',
  },
  'プリンス＆キングタイプ': {
    image: kingPrinceImage,
    name: 'プリンス＆キングタイプ',
  },
  'アイドル＆バリキャリタイプ': {
    image: idolCareerImage,
    name: 'アイドル＆バリキャリタイプ',
  },
  'バリキャリ＆マザータイプ': {
    image: careerMotherImage,
    name: 'バリキャリ＆マザータイプ',
  },
  'マザー＆アイドルタイプ': {
    image: motherIdolImage,
    name: 'マザー＆アイドルタイプ',
  },
}

const Result: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [displayType, setDisplayType] = useState<string>('')
  const [scores, setScores] = useState<{ [key: string]: number }>({})
  const [characterData, setCharacterData] = useState<CharacterImage | null>(
    null,
  )
  const { slug } = useParams()

  useEffect(() => {
    // ページの最上部にスクロール
    window.scrollTo(0, 0)

    const userGender = searchParams.get('gender') || 'female'

    // スコアの取得
    const newScores: { [key: string]: number } =
      userGender === 'male'
        ? {
            キングタイプ: parseInt(searchParams.get('king') || '0'),
            ナイトタイプ: parseInt(searchParams.get('knight') || '0'),
            プリンスタイプ: parseInt(searchParams.get('prince') || '0'),
          }
        : {
            アイドルタイプ: parseInt(searchParams.get('idol') || '0'),
            バリキャリタイプ: parseInt(searchParams.get('career') || '0'),
            マザータイプ: parseInt(searchParams.get('mother') || '0'),
          }

    setScores(newScores)

    // バランスタイプの判定
    let newDisplayType = ''
    const maxScore = Math.max(...Object.values(newScores))
    const maxTypes = Object.entries(newScores).filter(
      ([_, score]) => score === maxScore,
    )

    if (maxTypes.length === 3) {
      newDisplayType = 'バランスタイプ'
    } else if (maxTypes.length === 2) {
      const [type1, type2] = maxTypes.map(([type]) => type)
      if (userGender === 'male') {
        if (
          (type1 === 'キングタイプ' && type2 === 'ナイトタイプ') ||
          (type1 === 'ナイトタイプ' && type2 === 'キングタイプ')
        ) {
          newDisplayType = 'キング＆ナイトタイプ'
        } else if (
          (type1 === 'ナイトタイプ' && type2 === 'プリンスタイプ') ||
          (type1 === 'プリンスタイプ' && type2 === 'ナイトタイプ')
        ) {
          newDisplayType = 'ナイト＆プリンスタイプ'
        } else if (
          (type1 === 'プリンスタイプ' && type2 === 'キングタイプ') ||
          (type1 === 'キングタイプ' && type2 === 'プリンスタイプ')
        ) {
          newDisplayType = 'プリンス＆キングタイプ'
        }
      } else {
        if (
          (type1 === 'アイドルタイプ' && type2 === 'バリキャリタイプ') ||
          (type1 === 'バリキャリタイプ' && type2 === 'アイドルタイプ')
        ) {
          newDisplayType = 'アイドル＆バリキャリタイプ'
        } else if (
          (type1 === 'バリキャリタイプ' && type2 === 'マザータイプ') ||
          (type1 === 'マザータイプ' && type2 === 'バリキャリタイプ')
        ) {
          newDisplayType = 'バリキャリ＆マザータイプ'
        } else if (
          (type1 === 'マザータイプ' && type2 === 'アイドルタイプ') ||
          (type1 === 'アイドルタイプ' && type2 === 'マザータイプ')
        ) {
          newDisplayType = 'マザー＆アイドルタイプ'
        }
      }
    } else if (maxTypes.length === 1) {
      newDisplayType = maxTypes[0][0]
    }

    // タイプが設定されていない場合は、最も高いスコアのタイプを設定
    if (!newDisplayType) {
      const maxType = Object.entries(newScores).reduce((a, b) =>
        a[1] > b[1] ? a : b,
      )[0]
      newDisplayType = maxType
    }

    setDisplayType(newDisplayType)

    // キャラクター画像の設定
    if (newDisplayType === 'バランスタイプ') {
      const balanceImages = characterImages['バランスタイプ']
      if (
        balanceImages &&
        'male' in balanceImages &&
        'female' in balanceImages
      ) {
        const balanceImage = balanceImages[userGender as 'male' | 'female']
        setCharacterData(balanceImage)
      }
    } else {
      const selectedImage = characterImages[newDisplayType]
      if (selectedImage && 'image' in selectedImage) {
        setCharacterData(selectedImage)
      }
    }
  }, [searchParams])

  const descriptions: { [key: string]: string } = {
    アイドルタイプ:
      'あなたは人から大切にされることで自信を持つ、素直で感情豊かな魅力の持ち主。愛され上手で、自然と注目を集める華やかさがあります。',
    バリキャリタイプ:
      '冷静さと判断力が光るあなたは、どんな場面でも頼れる存在。しっかり者で周囲に安心感を与えますが、甘え下手な一面も。',
    マザータイプ:
      '人を癒し、自然と支えるあなたは、周囲に安心をもたらす存在。思いやりと包容力にあふれ、頼られることが多いでしょう。',
    キングタイプ:
      '堂々とした自信と統率力を持つあなたは、まるでヒーローのような頼れる存在。信念を貫く強さが、周囲に安心感を与えます。',
    ナイトタイプ:
      '誠実で思いやりがあり、人の心にそっと寄り添うタイプ。信頼関係を大切にし、優しい空気で相手を癒せる魅力があります。',
    プリンスタイプ:
      '自由な感性と少年のような好奇心で、周囲を楽しませる存在。ちょっとミステリアスなその魅力に、惹かれる人も多いはず。',
    バランスタイプ:
      searchParams.get('gender') === 'female'
        ? '愛されたい気持ちと自立心、そして思いやりの心を絶妙に持ち合わせたあなたは、状況に応じて自然体で対応できる魅力的な存在です。'
        : '頼もしさ、誠実さ、自由な発想をバランスよく備えたあなたは、柔軟性と包容力でどんな関係にも対応できるタイプです。',
    'キング＆ナイトタイプ':
      '決断力とやさしさをあわせ持つ、頼れる大人タイプ。リードしながらも、相手の気持ちにしっかり寄り添えるバランス感覚が魅力です。',
    'ナイト＆プリンスタイプ':
      '相手を思いやる誠実さと、自由で楽しい雰囲気を併せ持つタイプ。安心感と刺激のバランスが絶妙です。',
    'プリンス＆キングタイプ':
      '発想力とリーダーシップを兼ね備えたタイプ。自由さの中に強さがあり、周囲にインパクトを残す存在です。',
    'アイドル＆バリキャリタイプ':
      '可愛らしい感情表現と、しっかりとした芯の強さが共存するタイプ。恋愛でもギャップのある魅力を発揮します。',
    'バリキャリ＆マザータイプ':
      '冷静な判断力とやさしさを持つ、大人な癒し系タイプ。理性と共感力のバランスがとても魅力的です。',
    'マザー＆アイドルタイプ':
      '親しみやすいやさしさと、愛される魅力を併せ持つあなた。安心感とときめきを自然に与える存在です。',
  }

  const userGender = searchParams.get('gender') || 'female'

  return (
    <div className="font-['Noto_Sans_JP',sans-serif] bg-[#f0f7f7] m-0 p-5 text-center text-[#333] leading-relaxed min-h-screen flex flex-col justify-center">
      <div className="bg-white py-10 px-[30px] rounded-[15px] shadow-[0_8px_20px_rgba(106,193,208,0.1)] mx-auto max-w-[600px] w-full box-border border border-[rgba(106,193,208,0.1)]">
        <h1 className="text-[#5fb5d0] text-[28px] m-0 mb-[30px] font-bold leading-[1.4]">
          診断結果
        </h1>

        <div className="text-[22px] font-bold mb-[25px] text-[#2c3e50] leading-[1.4] px-[10px]">
          あなたのタイプは「{displayType}」です！
        </div>

        {characterData && (
          <div>
            <img
              src={characterData.image}
              alt={characterData.name}
              className="w-[200px] h-auto my-5 mx-auto block rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
            />
            <div className="text-sm text-[#666] my-[10px] text-center">
              {characterData.name}
            </div>
          </div>
        )}

        <div className="max-w-[600px] my-[30px] mx-auto p-5 bg-white rounded-xl shadow-[0_4px_15px_rgba(106,193,208,0.1)]">
          {userGender === 'female' ? (
            <>
              <div className="my-5">
                <div className="flex justify-between mb-2 font-medium text-[#2c3e50]">
                  <span>アイドルタイプ</span>
                  <span>{scores['アイドルタイプ']}%</span>
                </div>
                <div className="w-full h-6 bg-[#e9f5f7] rounded-xl overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] transition-[width] duration-1000 ease-[ease]"
                    style={{ width: `${scores['アイドルタイプ']}%` }}
                  />
                </div>
              </div>

              <div className="my-5">
                <div className="flex justify-between mb-2 font-medium text-[#2c3e50]">
                  <span>バリキャリタイプ</span>
                  <span>{scores['バリキャリタイプ']}%</span>
                </div>
                <div className="w-full h-6 bg-[#e9f5f7] rounded-xl overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] transition-[width] duration-1000 ease-[ease]"
                    style={{ width: `${scores['バリキャリタイプ']}%` }}
                  />
                </div>
              </div>

              <div className="my-5">
                <div className="flex justify-between mb-2 font-medium text-[#2c3e50]">
                  <span>マザータイプ</span>
                  <span>{scores['マザータイプ']}%</span>
                </div>
                <div className="w-full h-6 bg-[#e9f5f7] rounded-xl overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] transition-[width] duration-1000 ease-[ease]"
                    style={{ width: `${scores['マザータイプ']}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="my-5">
                <div className="flex justify-between mb-2 font-medium text-[#2c3e50]">
                  <span>キングタイプ</span>
                  <span>{scores['キングタイプ']}%</span>
                </div>
                <div className="w-full h-6 bg-[#e9f5f7] rounded-xl overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] transition-[width] duration-1000 ease-[ease]"
                    style={{ width: `${scores['キングタイプ']}%` }}
                  />
                </div>
              </div>

              <div className="my-5">
                <div className="flex justify-between mb-2 font-medium text-[#2c3e50]">
                  <span>ナイトタイプ</span>
                  <span>{scores['ナイトタイプ']}%</span>
                </div>
                <div className="w-full h-6 bg-[#e9f5f7] rounded-xl overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] transition-[width] duration-1000 ease-[ease]"
                    style={{ width: `${scores['ナイトタイプ']}%` }}
                  />
                </div>
              </div>

              <div className="my-5">
                <div className="flex justify-between mb-2 font-medium text-[#2c3e50]">
                  <span>プリンスタイプ</span>
                  <span>{scores['プリンスタイプ']}%</span>
                </div>
                <div className="w-full h-6 bg-[#e9f5f7] rounded-xl overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] transition-[width] duration-1000 ease-[ease]"
                    style={{ width: `${scores['プリンスタイプ']}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-base mb-[30px] text-[#456] leading-[1.8] text-left px-[15px]">
          {descriptions[displayType]}
        </div>

        <div className="text-center my-[35px] px-[15px]">
          <p className="text-[#FF69B4] text-[19px] font-medium mb-[25px] leading-relaxed">
            あなたの恋愛・婚活の可能性を広げるために...
            <br />
            気になる方をチェック！ ✨
          </p>

          <div className="flex flex-col gap-5 items-center">
            <div className="w-full max-w-[320px]">
              <a
                href="https://lin.ee/qSZORFf"
                className="bg-gradient-to-br from-[#FF88B3] to-[#FF69B4] text-white border-none py-4 px-5 text-sm font-semibold cursor-pointer rounded-[50px] transition-all duration-300 ease-[ease] flex items-center justify-center no-underline w-full box-border shadow-[0_5px_15px_rgba(255,136,179,0.2)] text-center tracking-[0.5px] leading-[1.4] whitespace-nowrap min-h-[50px]"
              >
                運命のパートナーが見つけやすくなる
                <br />
                トータルコーディネート
              </a>
              <p className="text-sm text-[#666] font-normal leading-relaxed mt-2 mb-0 text-left">
                外見＆内面！あなたが引き寄せたい理想の相手と出会うポイントを詳しく解説！
              </p>
            </div>

            <div className="w-full max-w-[320px]">
              <a
                href="https://trial-marriage-hunting.vercel.app/"
                className="bg-gradient-to-br from-[#FF88B3] to-[#FF69B4] text-white border-none py-4 px-5 text-sm font-semibold cursor-pointer rounded-[50px] transition-all duration-300 ease-[ease] flex items-center justify-center no-underline w-full box-border shadow-[0_5px_15px_rgba(255,136,179,0.2)] text-center tracking-[0.5px] leading-[1.4] whitespace-nowrap min-h-[50px]"
              >
                婚活に興味はあるけど不安な方へ
                <br />
                おためし婚活カウンセリング
              </a>
              <p className="text-sm text-[#666] font-normal leading-relaxed mt-2 mb-0 text-left">
                理想の出会いに向けて、あなたに合った婚活方法を提案しながらおためし婚活ができます！
              </p>
            </div>

            <div className="w-full max-w-[320px]">
              <a
                href="https://square.link/u/vQEat01w"
                className="bg-gradient-to-br from-[#FF88B3] to-[#FF69B4] text-white border-none py-4 px-5 text-sm font-semibold cursor-pointer rounded-[50px] transition-all duration-300 ease-[ease] flex items-center justify-center no-underline w-full box-border shadow-[0_5px_15px_rgba(255,136,179,0.2)] text-center tracking-[0.5px] leading-[1.4] whitespace-nowrap min-h-[50px]"
              >
                自分の取り扱い説明書を手に入れて
                <br />
                パートナー探しに活かす
              </a>
              <p className="text-sm text-[#666] font-normal leading-relaxed mt-2 mb-0 text-left">
                あなたのキャラタイプを婚活に活かすヒントをもっと深く知りたくありませんか？
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-[30px]">
          <Link
            to={`/${slug}`}
            className="bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] text-white border-none py-[14px] px-[25px] text-[15px] font-semibold cursor-pointer rounded-[50px] transition-all duration-300 ease-[ease] inline-block no-underline max-w-[200px] shadow-[0_5px_15px_rgba(106,193,208,0.2)] text-center tracking-[0.5px] leading-[1.5]"
          >
            診断トップに戻る
          </Link>
        </div>

        <div className="mt-[50px] text-[#666] text-xs">
          © 2025 BLANCA. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default Result
