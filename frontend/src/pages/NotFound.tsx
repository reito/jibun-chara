import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className="font-['Noto_Sans_JP',sans-serif] bg-[#f0f7f7] m-0 p-5 text-center text-[#333] leading-relaxed min-h-screen flex flex-col justify-center">
      <div className="bg-white py-10 px-[30px] rounded-[15px] shadow-[0_8px_20px_rgba(106,193,208,0.1)] mx-auto max-w-[600px] w-full box-border border border-[rgba(106,193,208,0.1)]">
        <h1 className="text-[#5fb5d0] text-[28px] m-0 mb-[30px] font-bold leading-[1.4]">
          404 - ページが見つかりません
        </h1>

        <p className="text-base mb-[30px] text-[#456] leading-[1.8]">
          お探しのページは存在しないか、移動した可能性があります。
        </p>

        <Link
          to="/"
          className="bg-gradient-to-br from-[#6ac1d0] to-[#5fb5d0] text-white border-none py-[14px] px-[25px] text-[15px] font-semibold cursor-pointer rounded-[50px] transition-all duration-300 ease-[ease] inline-block no-underline max-w-[200px] shadow-[0_5px_15px_rgba(106,193,208,0.2)] text-center tracking-[0.5px] leading-[1.5]"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}

export default NotFound
