import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface Question {
  id: number
  text: string
  scores: {
    idol: number
    career: number
    mother: number
  }
}

const questions: Question[] = [
  {
    id: 1,
    text: '飲み会で初対面の人と話すのは得意？',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 2,
    text: '自分の話をするより人の話を聞く方が楽しい。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 3,
    text: '毎日LINEをするのは面倒くさいと感じる。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 4,
    text: '飲み会の席ではつい気配りして料理を取り分ける？',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 5,
    text: '相手に尽くすよりも、自分が尽くされる方が嬉しい？',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 6,
    text: 'たまに自分が何をしたいのかわからなくなる時がある。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 7,
    text: '計画を立てたり、スケジュール管理が好きだ。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 8,
    text: 'パートナーには優しく甘えさせてほしいと思う。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 9,
    text: '自分のやるべきことはきっちりこなさないと気が済まない。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 10,
    text: '誰かが困っていたら放っておけない。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 11,
    text: '特別扱いをされると嬉しい。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 12,
    text: '人に頼るのは苦手で、自分でなんとかしようとする。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 13,
    text: 'カバンの中身が多くなりがち。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 14,
    text: 'デートのプランは相手に考えてほしい。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 15,
    text: '問題が起きた時、自分が主導して解決しようとする。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 16,
    text: '夢を持っている男性が好き。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 17,
    text: 'サプライズやプレゼントが好きで、相手に期待してしまう。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 18,
    text: '洋服や鞄は可愛いものよりも機能性を重視する。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 19,
    text: '自分の気持ちよりも、周りの人の意見を優先することが多い。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 20,
    text: '流行には敏感な方である。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 21,
    text: '相手が少し偉そうでも優柔不断な人よりマシと思う',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 22,
    text: '恋人とは「特別な日に特別な場所へ行きたい」と思う。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 23,
    text: '仕事や家事などは効率的にこなすタイプだ。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 24,
    text: 'よく道を聞かれることが多い。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 25,
    text: '歩く時は人の右側を歩きたい。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 26,
    text: '頭ポンポンされるのは正直いやだと感じる。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 27,
    text: '負ける勝負はしたくない。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 28,
    text: '即断即決する事が苦手だと思う。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 29,
    text: '人の目が気になる方である。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 30,
    text: '何かを決める時に直感を重視することが多い。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 31,
    text: '容姿や外見についての評価が大切である。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 32,
    text: '美容にお金を使うのが好きだ。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 33,
    text: '可愛いものやキラキラしたものを見ると欲しくなる。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 34,
    text: '男性には経済力を求めてしまう。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 35,
    text: 'SNSで自分の写真をよく投稿する方だ。',
    scores: { idol: 2, career: 0, mother: 0 },
  },
  {
    id: 36,
    text: '学校や職場ではリーダー的な立場になることが多い。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 37,
    text: '考えたことや思いついたことに対しすぐに行動する方だ。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 38,
    text: '周りを見ると努力が足りないと感じることが多い。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 39,
    text: '結婚しても仕事は続けたいと思っている。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 40,
    text: '女性も自律や自活する力が必要だと思う。',
    scores: { idol: 0, career: 2, mother: 0 },
  },
  {
    id: 41,
    text: '家事をすることは好きな方だ。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 42,
    text: '何か頼まれると断れないタイプだと思う。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 43,
    text: '結婚したら家庭を優先したい。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 44,
    text: '過去に浮気をされて許したことがある。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
  {
    id: 45,
    text: 'パートナーには安定した仕事・収入を求める。',
    scores: { idol: 0, career: 0, mother: 2 },
  },
]

const QuizFemale: React.FC = () => {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState(0)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])

  useEffect(() => {
    // 質問をシャッフル
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [])

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [`q${questionIndex}`]: value }
      const answeredCount = Object.keys(newAnswers).length
      setProgress((answeredCount / questions.length) * 100)
      return newAnswers
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 未回答の質問がないかチェック
    const unansweredQuestions = shuffledQuestions.filter(
      (q) => !answers[`q${q.id}`],
    )
    if (unansweredQuestions.length > 0) {
      const unansweredIndices = unansweredQuestions.map((q) => {
        const index = shuffledQuestions.findIndex((sq) => sq.id === q.id)
        return index + 1
      })
      alert(
        `以下の質問に回答してください：\n質問 ${unansweredIndices.join(', ')}`,
      )
      return
    }

    // 各タイプの質問数をカウント
    const totalQuestions = {
      idol: 10,
      career: 10,
      mother: 10,
    }

    // 各タイプの「そう思う」の回答数をカウント
    const selectedAnswers = { idol: 0, career: 0, mother: 0 }

    shuffledQuestions.forEach((q) => {
      const answer = answers[`q${q.id}`]
      if (answer === 'yes') {
        if (q.scores.idol > 0) selectedAnswers.idol++
        if (q.scores.career > 0) selectedAnswers.career++
        if (q.scores.mother > 0) selectedAnswers.mother++
      }
      // どちらとも言えないは0.5カウント
      else if (answer === 'neutral') {
        if (q.scores.idol > 0) selectedAnswers.idol += 0.5
        if (q.scores.career > 0) selectedAnswers.career += 0.5
        if (q.scores.mother > 0) selectedAnswers.mother += 0.5
      }
    })

    // パーセンテージを計算
    const percentages = {
      idol: Math.round((selectedAnswers.idol / totalQuestions.idol) * 100),
      career: Math.round(
        (selectedAnswers.career / totalQuestions.career) * 100,
      ),
      mother: Math.round(
        (selectedAnswers.mother / totalQuestions.mother) * 100,
      ),
    }

    // 結果ページへ遷移
    navigate(
      `/${slug}/result?gender=female&idol=${percentages.idol}&career=${percentages.career}&mother=${percentages.mother}`,
    )
  }

  return (
    <div className="font-['Noto_Sans_JP',sans-serif] bg-[#f0f7f7] text-[#333] m-0 p-0 leading-relaxed">
      <header className="bg-[linear-gradient(135deg,#6ac1d0_0%,#5fb5d0_100%)] p-5 text-center text-white relative shadow-[0_4px_15px_rgba(106,193,208,0.2)]">
        <h1
          className="m-0 text-[24px] font-bold tracking-[1px]"
          style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          じぶんキャラ診断
        </h1>
      </header>

      <nav className="flex justify-center flex-wrap bg-white py-[10px] px-[5px] shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <a
          href="https://blanca715.com/"
          className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap"
        >
          相談所トップ
        </a>
        <a
          href="https://blanca715.com/category/%e3%82%a4%e3%83%99%e3%83%b3%e3%83%88/"
          className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap"
        >
          イベント情報
        </a>
        <a
          href="https://blanca715.com/contact/"
          className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap"
        >
          無料相談予約
        </a>
        <a
          href="https://blanca715.com/achievement/"
          className="m-[5px_10px] p-[5px_10px] no-underline text-[#5fb5d0] font-medium text-sm relative transition-all duration-300 ease-[ease] whitespace-nowrap"
        >
          成婚事例
        </a>
      </nav>

      <main className="py-5 px-[15px] max-w-[800px] mx-auto">
        <div className="bg-white rounded-xl p-[15px] mb-5 shadow-[0_8px_20px_rgba(106,193,208,0.1)] border border-[rgba(106,193,208,0.1)] text-center">
          <p className="text-center m-0 text-[#5fb5d0] text-base font-medium tracking-[1px]">
            あなたの性格タイプを診断します
          </p>
          <div className="w-full h-[6px] bg-[#e9f5f7] rounded-[3px] mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] transition-[width] duration-300 ease-[ease]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] text-[#666]">
            回答済み: {Object.keys(answers).length} / {questions.length} 問
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {shuffledQuestions.map((question, index) => (
            <div
              key={question.id}
              className="mb-5 bg-white p-5 rounded-xl shadow-[0_8px_20px_rgba(106,193,208,0.1)] transition-[transform,box-shadow] duration-300 ease-[ease] border border-[rgba(106,193,208,0.1)]"
            >
              <p className="text-base mb-[15px] text-[#2c3e50] font-medium pb-[10px] border-b border-[rgba(106,193,208,0.1)] leading-[1.6]">
                {index + 1}. {question.text}
              </p>
              {['yes', 'neutral', 'no'].map((value) => (
                <label
                  key={value}
                  className="block my-3 cursor-pointer py-3 px-[15px] rounded-lg transition-colors duration-300 ease-[ease] text-[#456] text-[15px]"
                >
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    value={value}
                    checked={answers[`q${question.id}`] === value}
                    onChange={() => handleAnswerChange(question.id, value)}
                    className="mr-3 w-4 h-4 border-2 border-[#5fb5d0] rounded-full appearance-none bg-white outline-none cursor-pointer relative box-border checked:bg-white checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:w-2 checked:after:h-2 checked:after:bg-[#5fb5d0] checked:after:rounded-full"
                  />
                  {value === 'yes'
                    ? 'そう思う'
                    : value === 'neutral'
                      ? 'どちらとも言えない'
                      : 'そう思わない'}
                </label>
              ))}
            </div>
          ))}
          <button
            type="submit"
            className="bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] border-none py-4 px-[30px] text-white text-base font-medium cursor-pointer rounded-[30px] transition-all duration-300 ease-[ease] block my-[30px] mx-auto w-auto min-w-[200px] tracking-[1px] shadow-[0_5px_15px_rgba(106,193,208,0.3)] text-center"
          >
            診断結果を見る
          </button>
        </form>
      </main>
    </div>
  )
}

export default QuizFemale
