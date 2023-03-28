import React from 'react';
import logo from '../assets/about.png';
import { Color } from '../constants/constants';

const FinancialPaper = () => {
    return (
        <div className="med_text">
            <p>
                Traditional financial systems have seen tremendous growth in the
                popularity of prize-linked savings options over recent years.
                Offering prize-linked savings has been shown to increase
                utilization of savings options with evidence also suggesting
                that prize-linked gaming displaces higher risk behaviors such as
                gambling. As Defi develops to transform traditional financial
                systems, we believe there is a strong role for prize-linked
                gaming.
            </p>
            <p>
                To that end, we are bringing prize-linked staking back to the
                Algorand blockchain. By leveraging the Algorand Foundation
                Governance program, we are offering a weekly prize game on a
                background of low- yield staking.
            </p>
            <h2>
                <strong>Where does the prize money come from?</strong>
            </h2>
            <p>
                Prizes are generated on the interest earned on deposited funds.
                When a deposit is made into Optimum, funds are routed to
                non-custodial accounts which generate interest by participating
                in the Algorand Foundation Governance program. The registration
                and voting process is automated for our users with votes
                aligning with the Algorand Foundation&rsquo;s recommendations.
            </p>

            <p>
                A large portion of the ALGO rewards generated from participation
                in Governance is earmarked for the prize pool. Due to the nature
                of the Algorand Governance process, the Governance reward rate
                increases incrementally over the course of each period secondary
                to attrition of reward-eligible accounts. For this reason, the
                prize pool reward rate will always underestimate the true
                Governance reward rate. The difference is distributed equally to
                all participants in the Optimum protocol.
            </p>
            <img style={{ maxWidth: '45%' }} src={logo} />
            <h2>
                <strong>How do deposits work?</strong>
            </h2>
            <p>
                The web-based Optimum app is our interface for interacting with
                the smart contract deployed to the Algorand blockchain. Through
                this interface, users have the ability to deposit ALGO in
                exchange for the OPT token. Deposits are enabled after the
                reward distribution from the previous Governance period and
                prior to end of the sign-up phase for the current Governance
                period (a period that traditionally spans approximately ten
                days).
            </p>

            <p>
                The deposit exchange rate is determined at the beginning of the
                deposit window. For the first deposit period, the exchange rate
                of ALGO to OPT will be set to 1:1. For subsequent deposit
                windows, the exchange rate will be determined by the formula:
            </p>

            <h3>
                𝐸𝑅 = (𝑇𝑜𝑡𝑎𝑙 𝐴𝐿𝐺𝑂 ℎ𝑒𝑙𝑑 𝑏𝑦 𝑡ℎ𝑒 𝑂𝑝𝑡𝑖𝑚𝑢𝑚 𝑝𝑟𝑜𝑡𝑜𝑐𝑜𝑙): (𝑇𝑜𝑡𝑎𝑙 𝑂𝑃𝑇
                𝑑𝑖𝑠𝑡𝑟𝑖𝑏𝑢𝑡𝑒𝑑 𝑏𝑦 𝑡ℎ𝑒 𝑂𝑝𝑡𝑖𝑚𝑢𝑚 𝑝𝑟𝑜𝑡𝑜𝑐𝑜𝑙)
            </h3>

            <p>
                As an example, suppose 10,000 ALGO are deposited into the smart
                contract during the first quarter, 10,000 OPT will have been
                distributed. If the prize game reward rate for that period is
                1.5% and the Governance reward rate for that period is 2%, by
                the end of the first quarter, 10,150 OPT will have been
                distributed and 10,200 ALGO will have been distributed resulting
                in a deposit exchange rate of 1.00493 ALGO:OPT for the second
                quarter. This process is repeated for each subsequent quarter.
            </p>

            <h2>
                <strong>
                    Are withdrawals limited in the same way as deposits?
                </strong>
            </h2>
            <p>
                Optimum is a non-custodial protocol, which means the original
                user retains complete control of their funds. We recognize the
                importance of liquidity and have made careful design decisions
                to enable withdrawals at any time.
            </p>

            <p>
                The exchange rate for withdrawals is dynamic and equivalent to
                the formula used at the beginning of each deposit window. As in
                the above example, if the smart contract holds 10,200 ALGO and
                10,150 OPT, a user holding 1,000 OPT is entitled to
                approximately 1,004.93 ALGO.
            </p>

            <p>
                A small dynamic fee is assessed at the time of withdrawal. This
                is determined by the formula:
            </p>

            <p>
                𝑓𝑒𝑒 (%) = .001 + 𝑝𝑟𝑖𝑧𝑒 𝑔𝑎𝑚𝑒 𝑟𝑒𝑤𝑎𝑟𝑑 𝑟𝑎𝑡𝑒 / 13 &lowast; (13
                &minus; 𝑤𝑒𝑒𝑘𝑠 𝑢𝑛𝑡𝑖𝑙 𝑔𝑜𝑣𝑒𝑟𝑛𝑎𝑛𝑐𝑒 𝑟𝑒𝑤𝑎𝑟𝑑 𝑑𝑖𝑠𝑡𝑟𝑖𝑏𝑢𝑡𝑖𝑜𝑛)
            </p>

            <p>
                In the above example, if the user withdraws with 11 weeks
                remaining until reward distribution, he will be assessed a fee
                of .331%:
            </p>

            <p>.001 + .015 / 13 &lowast; 2 = .00331</p>

            <p>
                Note, if withdrawals are made in the first week following
                Governance reward distribution, the second condition will go to
                0, and a flat fee of .1% is assessed.
            </p>

            <p>
                An added benefit of our approach to ensuring the liquidity of
                these assets is the flexibility we inject into the Algorand
                Governance process. Traditionally, if a participant in
                Governance withdraws below their committed amount, they forfeit
                all Governance rewards. With our approach, you are free to
                withdraw whatever increment you deem necessary without
                forfeiting the staking power of your remaining balance. If a
                user holding 1,000 OPT exchanges 100 OPT with the Optimum smart
                contract, the remaining 900 OPT retains its value in the staking
                pool and remains qualified for the prize game.
            </p>

            <h2>
                <strong>What are the risks?</strong>
            </h2>
            <p>
                Assuming the protocol operates as intended, there is no risk of
                losing your money. However, there are risks inherent to using a
                blockchain-based protocol which include the possibility of a bug
                or exploit in the underlying smart contract that runs the
                Optimum Protocol. This is a risk with any product on the
                Algorand blockchain. In these cases, individuals exploit
                vulnerabilities in smart contracts to steal cryptocurrency. We
                have attempted to mitigate this risk with rigorous internal and
                external testing. Additionally, we&rsquo;ve hired a security
                firm to professionally review and audit the smart contract code
                for any bugs or exploits.
            </p>

            <h2>
                <strong>What fees are associated with the platform?</strong>
            </h2>
            <p>
                In addition to the dynamic withdrawal fee described above, 10%
                of the prize pool is collected to pay for infrastructure,
                marketing, and other business costs.
            </p>

            <h2>
                <strong>What are the odds of winning?</strong>
            </h2>
            <p>
                The odds of winning are dependent on individual user OPT balance
                relative to the total OPT distributed by the Optimum smart
                contract. The more ALGO deposited, the higher the odds of
                winning. The exact chance to win changes dynamically relative to
                other users depositing and withdrawing.
            </p>

            <p>
                As an example, if ten users deposit 1,000 ALGO, each user would
                have a 10% chance of winning the prize pool each of the 13
                weeks.
            </p>

            <h2>
                <strong>What is the prize amount?</strong>
            </h2>
            <p>
                The prize pool will be determined at the beginning of every week
                of a Governance quarter (13 weeks total). This will be
                determined by evaluating the current Governance period APR,
                which will be obtained from data posted on the Algorand
                Foundation Governance website.
            </p>

            <table>
                <tbody>
                    <th colSpan={8}>
                        <strong>Historical Governance Quarterly Yields</strong>
                    </th>
                    <tr>
                        <td>
                            <strong>Q1</strong>
                        </td>
                        <td></td>
                        <td>
                            <strong>Q2</strong>
                        </td>
                        <td></td>
                        <td>
                            <strong>Q3</strong>
                        </td>
                        <td></td>
                        <td>
                            <strong>Q4</strong>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <strong>3.51%</strong>
                        </td>
                        <td></td>
                        <td>
                            <strong>2.51%</strong>
                        </td>
                        <td></td>
                        <td>
                            <strong>1.99%</strong>
                        </td>
                        <td></td>
                        <td>
                            <strong>1.93%</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h2>
                <strong>How is a winner selected?</strong>
            </h2>
            <p>
                At the time of prize drawing, a snapshot is secured of all
                current OPT holders and prize-eligible wallets. Utilizing this
                data, a cumulative probability distribution is generated. In
                conjunction a random number is generated and this is matched to
                the closest value within the probability range.
            </p>

            <p>
                The following table illustrates our mechanism with an example of
                five wallets participating with ascending OPT balances of 10,
                20, 30, 40, and 50:
            </p>
            <tbody>
                <th colSpan={5}>
                    <strong>Winner Selection</strong>
                </th>
                <tr style={{ fontWeight: 'bolder' }}>
                    <td>User</td>
                    <td>Holdings (OPT)</td>
                    <td>Probability</td>
                    <td>Cumulative Probability</td>
                    <td>
                        Random Number
                        <div>0.6147556</div>
                        <div style={{ color: Color.RED, fontWeight: 600 }}>
                            Winner
                            <br />
                            <div>User 4</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>10</td>
                    <td>6.7%</td>
                    <td>0%</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>20</td>
                    <td>13.3%</td>
                    <td>6.7%</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>30</td>
                    <td>20%</td>
                    <td>20%</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>40</td>
                    <td>26.7%</td>
                    <td>40%</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>50</td>
                    <td>33.3%</td>
                    <td>66.7%</td>
                </tr>
            </tbody>
            <h2>
                <strong>How are prizes distributed?</strong>
            </h2>
            <p>
                Prizes are awarded in OPT and distributed automatically to the
                winning wallet address. These winners are posted to a public
                list, accessible through the web-based application.
            </p>
            <h2>
                <strong>Do I have to enter for each weekly prize? </strong>
            </h2>
            <p>
                Deposits are automatically eligible for weekly prizes until
                withdrawn. As described in Terms and Conditions, mail in
                submissions can also be made within the first two weeks of a
                Governance period. Individuals submitting a mail-in entry will
                be treated as if depositing 10 ALGO.
            </p>
        </div>
    );
};

export default FinancialPaper;
