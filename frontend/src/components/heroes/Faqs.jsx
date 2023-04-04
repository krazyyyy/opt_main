import React from 'react'
import Faq from '../utils/Faq'
const faqData =[
  {
      id:1,
      question:"How do deposits work?",
      answer:`<p>The web-based Optimum app is our interface for interacting with the smart contract deployed to the
      Algorand blockchain. Through this interface, users have the ability to deposit ALGO in exchange for the
      OPT token. Deposits are enabled after the reward distribution from the previous Governance period and
      prior to the end of the sign-up phase for the current governance period (a period that traditionally spans
      approximately ten days). </p>
    </br></br>
      <p>The deposit exchange rate is determined at the beginning of the deposit window utilizing the formula:       </p>
      </br>
      The deposit exchange rate is determined at the beginning of the deposit window. For the first deposit period, the exchange rate of ALGO to OPT will be set to 1:1. For subsequent deposit windows, the exchange rate will be determined by the formula:</br>
      </br>
   `
  },
  {
      id:2,
      question:"Are withdrawals limited in the same way as deposits?",
      answer:`“Optimum is a non-custodial protocol, which means the original user retains complete control of their
      funds. We recognize the importance of liquidity and have made careful design choices to enable
      withdrawals at any time. The exchange rate for withdrawals uses the same formula used for deposits
      but is recalculated at the time of each transaction.</br>
      </br>
      A small fee of 0.1% is assessed at the time of withdrawal. Additionally, there is a dynamic fee which
increases with each prize dispersal. Importantly, if users hold for the duration of the governance period,
only the 0.1% fee will be assessed. The dynamic fee is in place only to cover losses incurred by ineligible
governance commitments. 
      </br>
      </br>
      With this approach, you are fee to withdraw whatever increment you deem necessary without forfeiting
      the staking power of your remaining balance. If a user holding 1,000 OPT exchanges 100 OPT, the
      remaining 900 OPT retains its value in the staking pool and remains qualified for the prize game.”`
  },
  {
      id:3,
      question:"What are the risks?",
      answer:"Assuming the protocol operates as intended, there is no risk of losing your money. However, there are risks inherent to using a blockchain-based protocol which include the possibility of a bug or exploit in the underlying smart contract that runs the Optimum Protocol. This is a risk with any product on the Algorand blockchain. In these cases, individuals exploit vulnerabilities in smart contracts to steal cryptocurrency. We have attempted to mitigate this risk with rigorous internal and external testing. Additionally, we’ve hired a security firm to professionally review and audit the smart contract code for any bugs or exploits."
  },
  {
      id:4,
      question:"What fees are associated with the platform?",
      answer:`In addition to the dynamic withdrawal fee described above, 10% of the prize pool is collected to pay for infrastructure, marketing, and other business costs.

      `
  },
  {
      id:5,
      question:"What are the odds of winning?",
      answer:`The odds of winning are dependent on individual user OPT balance relative to the total OPT distributed by the Optimum smart contract. The more ALGO deposited, the higher the odds of winning. The exact chance to win changes dynamically relative to other users depositing and withdrawing.
      </br></br>
      As an example, if ten users deposit 1,000 ALGO, each user would have a 10% chance of winning the prize pool each of the 13 weeks.`
  },
] 

const Faqs = () => {

  const handleClick = (e) => {
    const selectedChevron = e.target.closest(".chevron");
  
    if (selectedChevron) {
      console.log("chev");
      const selectedDropdown = e.target.parentElement.parentElement.querySelector(
        ".main"
      );
  
      document.querySelectorAll(".main").forEach((dropdown) => {
        if (selectedDropdown === dropdown) {
          dropdown.classList.toggle("active");
          selectedChevron.classList.toggle("upside-down"); // Add or remove the class to toggle the chevron icon
        } else {
          dropdown.classList.remove("active");
        }
      });
    } else {
      const selectedDropdown = e.target.parentElement.querySelector(".main");
  
      document.querySelectorAll(".main").forEach((dropdown) => {
        if (selectedDropdown === dropdown) {
          dropdown.classList.toggle("active");
          const chevronIcon = e.target.querySelector(".chevron");
          if (chevronIcon) {
            chevronIcon.classList.toggle("upside-down"); // Add or remove the class to toggle the chevron icon
          }
        } else {
          dropdown.classList.remove("active");
        }
      });
    }
  };
  
  return (
    <section className="question">
    <div className="Container w-[332px] md:w-[87.65625vw] mx-[auto] pt-[5vw]">
      <div>
        <h2 className="text-[32px] colus leading-[38.4px] md:text-[2.5vw] text-[#F5F5F5] font-[400] md:w-[45.625vw]
text-center mx-[auto] 
md:leading-[3vw]
">do you have more questions? check the answers</h2>
      </div>
      <div className="flex flex-col pt-[32px] pb-[40px] gap-y-[16px] md:gap-y-[1.25vw] md:pt-[2.5vw] md:pb-[6.25vw]">
      
{faqData.map((curEl)=>(
  <Faq key={curEl.id} {...curEl} handleClick={handleClick}/>
  
))}

      
      </div>
    </div>
  </section>
  )
}

export default Faqs