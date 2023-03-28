import React from 'react'
import Answer from './Answer'
import Question from './Question'

const Faq = ({handleClick,question,answer}) => {

  return (
    <div className="    

    ">
    <Question question={question}  handleClick={handleClick}/>
            <Answer answer={answer}/>
            </div>
  )
}

export default Faq
