import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BaseProps } from '../types';

// 画像のインポート
import kingImage from '../assets/img/character-king.png';
import knightImage from '../assets/img/character-knight.png';
import princeImage from '../assets/img/character-prince.png';
import idolImage from '../assets/img/character-idol.png';
import careerImage from '../assets/img/character-career.png';
import motherImage from '../assets/img/character-mother.png';
import kingKnightImage from '../assets/img/character-king-knight.png';
import knightPrinceImage from '../assets/img/character-knight-prince.png';
import kingPrinceImage from '../assets/img/character-king-prince.png';
import idolCareerImage from '../assets/img/character-idol-career.png';
import careerMotherImage from '../assets/img/character-career-mother.png';
import motherIdolImage from '../assets/img/character-mother-idol.png';
import characterBalanceMaleImage from '../assets/img/character-balance-male.png';
import characterBalanceFemaleImage from '../assets/img/character-balance-female.png';

interface CharacterImage {
  image: string;
  name: string;
}

interface CharacterImages {
  [key: string]: CharacterImage | {
    male: CharacterImage;
    female: CharacterImage;
  };
}

const characterImages: CharacterImages = {
  "キングタイプ": {
    image: kingImage,
    name: "キングタイプ"
  },
  "ナイトタイプ": {
    image: knightImage,
    name: "ナイトタイプ"
  },
  "プリンスタイプ": {
    image: princeImage,
    name: "プリンスタイプ"
  },
  "アイドルタイプ": {
    image: idolImage,
    name: "アイドルタイプ"
  },
  "バリキャリタイプ": {
    image: careerImage,
    name: "バリキャリタイプ"
  },
  "マザータイプ": {
    image: motherImage,
    name: "マザータイプ"
  },
  "バランスタイプ": {
    male: {
      image: characterBalanceMaleImage,
      name: "バランスタイプ（男性）"
    },
    female: {
      image: characterBalanceFemaleImage,
      name: "バランスタイプ（女性）"
    }
  },
  "キング＆ナイトタイプ": {
    image: kingKnightImage,
    name: "キング＆ナイトタイプ"
  },
  "ナイト＆プリンスタイプ": {
    image: knightPrinceImage,
    name: "ナイト＆プリンスタイプ"
  },
  "プリンス＆キングタイプ": {
    image: kingPrinceImage,
    name: "プリンス＆キングタイプ"
  },
  "アイドル＆バリキャリタイプ": {
    image: idolCareerImage,
    name: "アイドル＆バリキャリタイプ"
  },
  "バリキャリ＆マザータイプ": {
    image: careerMotherImage,
    name: "バリキャリ＆マザータイプ"
  },
  "マザー＆アイドルタイプ": {
    image: motherIdolImage,
    name: "マザー＆アイドルタイプ"
  }
};

const Result: React.FC<BaseProps> = ({ basePath }) => {
  const [searchParams] = useSearchParams();
  const [displayType, setDisplayType] = useState<string>('');
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [characterData, setCharacterData] = useState<CharacterImage | null>(null);

  useEffect(() => {
    // ページの最上部にスクロール
    window.scrollTo(0, 0);

    const userGender = searchParams.get('gender') || 'female';
    const resultType = searchParams.get('result');

    // スコアの取得
    const newScores: { [key: string]: number } = userGender === 'male'
      ? {
          "キングタイプ": parseInt(searchParams.get('king') || '0'),
          "ナイトタイプ": parseInt(searchParams.get('knight') || '0'),
          "プリンスタイプ": parseInt(searchParams.get('prince') || '0')
        }
      : {
          "アイドルタイプ": parseInt(searchParams.get('idol') || '0'),
          "バリキャリタイプ": parseInt(searchParams.get('career') || '0'),
          "マザータイプ": parseInt(searchParams.get('mother') || '0')
        };

    setScores(newScores);

    // バランスタイプの判定
    let newDisplayType = '';
    const maxScore = Math.max(...Object.values(newScores));
    const maxTypes = Object.entries(newScores).filter(([_, score]) => score === maxScore);

    if (maxTypes.length === 3) {
      newDisplayType = "バランスタイプ";
    } else if (maxTypes.length === 2) {
      const [type1, type2] = maxTypes.map(([type]) => type);
      if (userGender === 'male') {
        if ((type1 === "キングタイプ" && type2 === "ナイトタイプ") || (type1 === "ナイトタイプ" && type2 === "キングタイプ")) {
          newDisplayType = "キング＆ナイトタイプ";
        } else if ((type1 === "ナイトタイプ" && type2 === "プリンスタイプ") || (type1 === "プリンスタイプ" && type2 === "ナイトタイプ")) {
          newDisplayType = "ナイト＆プリンスタイプ";
        } else if ((type1 === "プリンスタイプ" && type2 === "キングタイプ") || (type1 === "キングタイプ" && type2 === "プリンスタイプ")) {
          newDisplayType = "プリンス＆キングタイプ";
        }
      } else {
        if ((type1 === "アイドルタイプ" && type2 === "バリキャリタイプ") || (type1 === "バリキャリタイプ" && type2 === "アイドルタイプ")) {
          newDisplayType = "アイドル＆バリキャリタイプ";
        } else if ((type1 === "バリキャリタイプ" && type2 === "マザータイプ") || (type1 === "マザータイプ" && type2 === "バリキャリタイプ")) {
          newDisplayType = "バリキャリ＆マザータイプ";
        } else if ((type1 === "マザータイプ" && type2 === "アイドルタイプ") || (type1 === "アイドルタイプ" && type2 === "マザータイプ")) {
          newDisplayType = "マザー＆アイドルタイプ";
        }
      }
    } else if (maxTypes.length === 1) {
      newDisplayType = maxTypes[0][0];
    }

    // タイプが設定されていない場合は、最も高いスコアのタイプを設定
    if (!newDisplayType) {
      const maxType = Object.entries(newScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      newDisplayType = maxType;
    }

    setDisplayType(newDisplayType);

    // キャラクター画像の設定
    if (newDisplayType === "バランスタイプ") {
      const balanceImage = characterImages["バランスタイプ"][userGender as 'male' | 'female'];
      setCharacterData(balanceImage);
    } else {
      const selectedImage = characterImages[newDisplayType];
      if (selectedImage && 'image' in selectedImage) {
        setCharacterData(selectedImage);
      }
    }
  }, [searchParams]);

  const descriptions: { [key: string]: string } = {
    "アイドルタイプ": "あなたは人から大切にされることで自信を持つ、素直で感情豊かな魅力の持ち主。愛され上手で、自然と注目を集める華やかさがあります。",
    "バリキャリタイプ": "冷静さと判断力が光るあなたは、どんな場面でも頼れる存在。しっかり者で周囲に安心感を与えますが、甘え下手な一面も。",
    "マザータイプ": "人を癒し、自然と支えるあなたは、周囲に安心をもたらす存在。思いやりと包容力にあふれ、頼られることが多いでしょう。",
    "キングタイプ": "堂々とした自信と統率力を持つあなたは、まるでヒーローのような頼れる存在。信念を貫く強さが、周囲に安心感を与えます。",
    "ナイトタイプ": "誠実で思いやりがあり、人の心にそっと寄り添うタイプ。信頼関係を大切にし、優しい空気で相手を癒せる魅力があります。",
    "プリンスタイプ": "自由な感性と少年のような好奇心で、周囲を楽しませる存在。ちょっとミステリアスなその魅力に、惹かれる人も多いはず。",
    "バランスタイプ": searchParams.get('gender') === 'female'
      ? "愛されたい気持ちと自立心、そして思いやりの心を絶妙に持ち合わせたあなたは、状況に応じて自然体で対応できる魅力的な存在です。"
      : "頼もしさ、誠実さ、自由な発想をバランスよく備えたあなたは、柔軟性と包容力でどんな関係にも対応できるタイプです。",
    "キング＆ナイトタイプ": "決断力とやさしさをあわせ持つ、頼れる大人タイプ。リードしながらも、相手の気持ちにしっかり寄り添えるバランス感覚が魅力です。",
    "ナイト＆プリンスタイプ": "相手を思いやる誠実さと、自由で楽しい雰囲気を併せ持つタイプ。安心感と刺激のバランスが絶妙です。",
    "プリンス＆キングタイプ": "発想力とリーダーシップを兼ね備えたタイプ。自由さの中に強さがあり、周囲にインパクトを残す存在です。",
    "アイドル＆バリキャリタイプ": "可愛らしい感情表現と、しっかりとした芯の強さが共存するタイプ。恋愛でもギャップのある魅力を発揮します。",
    "バリキャリ＆マザータイプ": "冷静な判断力とやさしさを持つ、大人な癒し系タイプ。理性と共感力のバランスがとても魅力的です。",
    "マザー＆アイドルタイプ": "親しみやすいやさしさと、愛される魅力を併せ持つあなた。安心感とときめきを自然に与える存在です。"
  };

  const userGender = searchParams.get('gender') || 'female';

  return (
    <div style={{
      fontFamily: "'Noto Sans JP', sans-serif",
      backgroundColor: '#f0f7f7',
      margin: 0,
      padding: '20px',
      textAlign: 'center',
      color: '#333',
      lineHeight: 1.6,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px 30px',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(106, 193, 208, 0.1)',
        margin: '0 auto',
        maxWidth: '600px',
        width: '100%',
        boxSizing: 'border-box',
        border: '1px solid rgba(106, 193, 208, 0.1)'
      }}>
        <h1 style={{
          color: '#5fb5d0',
          fontSize: '28px',
          margin: '0 0 30px',
          fontWeight: 700,
          lineHeight: 1.4
        }}>
          診断結果
        </h1>

        <div style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '25px',
          color: '#2c3e50',
          lineHeight: 1.4,
          padding: '0 10px'
        }}>
          あなたのタイプは「{displayType}」です！
        </div>

        {characterData && (
          <div>
            <img
              src={characterData.image}
              alt={characterData.name}
              style={{
                width: '200px',
                height: 'auto',
                margin: '20px auto',
                display: 'block',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
              }}
            />
            <div style={{
              fontSize: '14px',
              color: '#666',
              margin: '10px 0',
              textAlign: 'center'
            }}>
              {characterData.name}
            </div>
          </div>
        )}

        <div style={{
          maxWidth: '600px',
          margin: '30px auto',
          padding: '20px',
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(106, 193, 208, 0.1)'
        }}>
          {userGender === 'female' ? (
            <>
              <div style={{ margin: '20px 0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontWeight: 500,
                  color: '#2c3e50'
                }}>
                  <span>アイドルタイプ</span>
                  <span>{scores["アイドルタイプ"]}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '24px',
                  background: '#e9f5f7',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scores["アイドルタイプ"]}%`,
                    background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontWeight: 500,
                  color: '#2c3e50'
                }}>
                  <span>バリキャリタイプ</span>
                  <span>{scores["バリキャリタイプ"]}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '24px',
                  background: '#e9f5f7',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scores["バリキャリタイプ"]}%`,
                    background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontWeight: 500,
                  color: '#2c3e50'
                }}>
                  <span>マザータイプ</span>
                  <span>{scores["マザータイプ"]}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '24px',
                  background: '#e9f5f7',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scores["マザータイプ"]}%`,
                    background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ margin: '20px 0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontWeight: 500,
                  color: '#2c3e50'
                }}>
                  <span>キングタイプ</span>
                  <span>{scores["キングタイプ"]}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '24px',
                  background: '#e9f5f7',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scores["キングタイプ"]}%`,
                    background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontWeight: 500,
                  color: '#2c3e50'
                }}>
                  <span>ナイトタイプ</span>
                  <span>{scores["ナイトタイプ"]}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '24px',
                  background: '#e9f5f7',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scores["ナイトタイプ"]}%`,
                    background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontWeight: 500,
                  color: '#2c3e50'
                }}>
                  <span>プリンスタイプ</span>
                  <span>{scores["プリンスタイプ"]}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '24px',
                  background: '#e9f5f7',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${scores["プリンスタイプ"]}%`,
                    background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{
          fontSize: '16px',
          marginBottom: '30px',
          color: '#456',
          lineHeight: 1.8,
          textAlign: 'left',
          padding: '0 15px'
        }}>
          {descriptions[displayType]}
        </div>

        <div style={{
          textAlign: 'center',
          margin: '35px 0',
          padding: '0 15px'
        }}>
          <p style={{
            color: '#FF69B4',
            fontSize: '19px',
            fontWeight: 500,
            marginBottom: '25px',
            lineHeight: 1.6
          }}>
            あなたの恋愛・婚活の可能性を広げるために...<br />気になる方をチェック！ ✨
          </p>

          <a
            href="https://lin.ee/qSZORFf"
            style={{
              background: 'linear-gradient(135deg, #FF88B3 0%, #FF69B4 100%)',
              color: '#fff',
              border: 'none',
              padding: '16px 25px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              display: 'block',
              textDecoration: 'none',
              margin: '0 auto',
              width: '100%',
              maxWidth: '320px',
              boxSizing: 'border-box',
              boxShadow: '0 5px 15px rgba(255, 136, 179, 0.2)',
              textAlign: 'center',
              letterSpacing: '0.5px',
              lineHeight: 1.5
            }}
          >
            運命のパートナーが見つけやすくなる<br />トータルコーディネート
          </a>
          <p style={{
            fontSize: '14px',
            color: '#666',
            display: 'block',
            fontWeight: 'normal',
            lineHeight: 1.6,
            margin: '8px auto 25px',
            maxWidth: '320px',
            textAlign: 'center'
          }}>
            外見＆内面！あなたが引き寄せたい理想の相手<br />と出会うポイントを詳しく解説！
          </p>

          <a
            href="https://trial-marriage-hunting.vercel.app/"
            style={{
              background: 'linear-gradient(135deg, #FF88B3 0%, #FF69B4 100%)',
              color: '#fff',
              border: 'none',
              padding: '16px 25px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              display: 'block',
              textDecoration: 'none',
              margin: '0 auto',
              width: '100%',
              maxWidth: '320px',
              boxSizing: 'border-box',
              boxShadow: '0 5px 15px rgba(255, 136, 179, 0.2)',
              textAlign: 'center',
              letterSpacing: '0.5px',
              lineHeight: 1.5
            }}
          >
            婚活に興味はあるけど不安な方へ<br />おためし婚活カウンセリング
          </a>
          <p style={{
            fontSize: '14px',
            color: '#666',
            display: 'block',
            fontWeight: 'normal',
            lineHeight: 1.6,
            margin: '8px auto 25px',
            maxWidth: '320px',
            textAlign: 'center'
          }}>
            理想の出会いに向けて、あなたに合った婚活方法を提案しながらおためし婚活ができます！
          </p>

          <a
            href="https://square.link/u/vQEat01w"
            style={{
              background: 'linear-gradient(135deg, #FF88B3 0%, #FF69B4 100%)',
              color: '#fff',
              border: 'none',
              padding: '16px 25px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              display: 'block',
              textDecoration: 'none',
              margin: '0 auto',
              width: '100%',
              maxWidth: '320px',
              boxSizing: 'border-box',
              boxShadow: '0 5px 15px rgba(255, 136, 179, 0.2)',
              textAlign: 'center',
              letterSpacing: '0.5px',
              lineHeight: 1.5
            }}
          >
            自分の取り扱い説明書を手に入れて<br />パートナー探しに活かす
          </a>
          <p style={{
            fontSize: '14px',
            color: '#666',
            display: 'block',
            fontWeight: 'normal',
            lineHeight: 1.6,
            margin: '8px auto 25px',
            maxWidth: '320px',
            textAlign: 'center'
          }}>
            あなたのキャラタイプを婚活に活かすヒント<br />をもっと深く知りたくありませんか？
          </p>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <Link
            to={basePath + '/'}
            style={{
              background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
              color: '#fff',
              border: 'none',
              padding: '14px 25px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              textDecoration: 'none',
              maxWidth: '200px',
              boxShadow: '0 5px 15px rgba(106, 193, 208, 0.2)',
              textAlign: 'center',
              letterSpacing: '0.5px',
              lineHeight: 1.5
            }}
          >
            診断トップに戻る
          </Link>
        </div>

        <div style={{
          marginTop: '50px',
          color: '#666',
          fontSize: '12px'
        }}>
          © 2025 BLANCA. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Result; 