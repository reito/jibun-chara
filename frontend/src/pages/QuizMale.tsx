import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'

interface Question {
  id: number
  text: string
  scores: {
    king: number
    knight: number
    prince: number
  }
}

const questions: Question[] = [
  {
    id: 1,
    text: '友人との飲み会では、自分が話の中心になることが多い。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 2,
    text: '気が付けば、他人の相談にのってアドバイスしていることが多い。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 3,
    text: '新しいことに挑戦するのが好きだ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 4,
    text: '用事がなければ自分からLINEや電話はしないタイプだ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 5,
    text: 'リーダーやキャプテンという立場になることが多い方だ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 6,
    text: '「どうにかなるさ」と考える方だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 7,
    text: 'デートでは、行き先やスケジュールは自分が決めたい方だ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 8,
    text: '食事に行く際、相手の好きな食べ物を気にかける方だ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 9,
    text: '「突然の予定変更」にも柔軟に対応できる方だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 10,
    text: '「人の話を最後まで聞く」のが得意だ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 11,
    text: '目標を立てると「絶対に達成する」と意気込む方だ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 12,
    text: '仲間内では「優しい」「気遣いができる」と言われることが多い。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 13,
    text: '旅行では、スケジュールをガチガチに決めるより、現地の雰囲気で動きたい。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 14,
    text: '「自分の意見はしっかり伝えるべき」と思う。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 15,
    text: '家庭より仕事を優先してしまうタイプだ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 16,
    text: '「決められたルール」に縛られるのは苦手だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 17,
    text: 'わりとコスパ重視なタイプだ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 18,
    text: '「困った時は誰かに相談するのが一番」と思う。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 19,
    text: '「今が楽しければそれでいい」と思うことがある。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 20,
    text: '新しい環境に入ったとき、まずは自分から声をかけることが多い。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 21,
    text: '相手の話をじっくり聞いてから、自分の意見を伝えるタイプだ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 22,
    text: '「ノリで決めたこと」がうまくいくことが多い。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 23,
    text: '「やると決めたら最後までやり遂げるべきだ」と思う。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 24,
    text: '服装はデザインよりも着心地を重視する。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 25,
    text: '「予定がない週末が一番好き」だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 26,
    text: '結婚したら家事は奥さんに任せたい。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 27,
    text: '何事もNo. 1を目指したいタイプ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 28,
    text: '結婚したら共働き希望。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 29,
    text: 'ルールは忠実に守るタイプだ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 30,
    text: '年上の女性と付き合うことに抵抗がない。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 31,
    text: '普段からオシャレには気を遣っている。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 32,
    text: '食事などに行った際女性に奢ってもらうのには抵抗がある。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 33,
    text: '思い立ったらすぐに行動するタイプだと思う。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 34,
    text: '人から尊敬されたいと思う。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 35,
    text: '人に謝るのはどちらかというと嫌いだ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 36,
    text: 'リーダーの立場より支える立場の方があっていると思う。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 37,
    text: '女性に対し引っ張るより合わせてしまうことが多い。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 38,
    text: '家事育児は積極的に協力したいタイプ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 39,
    text: '自分よりは相手を優先するタイプ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 40,
    text: '衝動的な行動はどちらかというと苦手だ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 41,
    text: 'まわりから可愛がられるタイプだと思う。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 42,
    text: '責任ある仕事や立場にはできるだけ就きたくない',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 43,
    text: '自分より収入の多い女性と付き合うことに抵抗はない方だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 44,
    text: '自分の趣味ややりたいことを優先するタイプだ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 45,
    text: '女性に対して求めるのは癒しだ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
]

const QuizMale: React.FC = () => {
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
      king: 10,
      knight: 10,
      prince: 10,
    }

    // 各タイプの「そう思う」の回答数をカウント
    const selectedAnswers = { king: 0, knight: 0, prince: 0 }

    shuffledQuestions.forEach((q) => {
      const answer = answers[`q${q.id}`]
      if (answer === 'yes') {
        if (q.scores.king > 0) selectedAnswers.king++
        if (q.scores.knight > 0) selectedAnswers.knight++
        if (q.scores.prince > 0) selectedAnswers.prince++
      }
      // どちらとも言えないは0.5カウント
      else if (answer === 'neutral') {
        if (q.scores.king > 0) selectedAnswers.king += 0.5
        if (q.scores.knight > 0) selectedAnswers.knight += 0.5
        if (q.scores.prince > 0) selectedAnswers.prince += 0.5
      }
    })

    // パーセンテージを計算
    const percentages = {
      king: Math.round((selectedAnswers.king / totalQuestions.king) * 100),
      knight: Math.round(
        (selectedAnswers.knight / totalQuestions.knight) * 100,
      ),
      prince: Math.round(
        (selectedAnswers.prince / totalQuestions.prince) * 100,
      ),
    }

    // 結果ページへ遷移
    navigate(
      `/${slug}/result?gender=male&king=${percentages.king}&knight=${percentages.knight}&prince=${percentages.prince}`,
    )
  }

  return (
    <div className="font-['Noto_Sans_JP',sans-serif] bg-[#f0f7f7] text-[#333] m-0 p-0 leading-relaxed">
      <Header />

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

export default QuizMale
