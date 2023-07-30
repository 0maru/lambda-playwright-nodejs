'use client'

import axios from 'axios'
import { useState } from 'react'

const Page = () => {
  const [text, setText] = useState()

  return <>
    <div>
      <div>
        <input placeholder={'url を入力してください'} value={text} />
        <button onClick={async () => {
          await getPageData(text)
        }
        }>読み取る
        </button>
      </div>
      <div>
        <p>タイトル</p>
        <p>商品詳細</p>
        <p>画像</p>
        <p>金額</p>
      </div>
    </div>
  </>
}

async function getPageData(url : string) {
  console.log('getPageData')
  const endpoint = 'https://qkv7va05m3.execute-api.ap-northeast-1.amazonaws.com/default/lambda-playwright-nodejs-backend'
  const response = await axios.get(endpoint, {
    params: {
      url
    }
  })
  console.log(response)
}

export default Page
