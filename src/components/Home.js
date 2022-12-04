import sketch from "../data/sketch.png"

export default function Home() {

    return (
        <div className="flex-1 flex flex-col justify-center items-center gap-12 p-4">
            <p className="text-4xl text-center font-bold">The Radish Story</p>

            <div className="max-w-2xl">
                <img src={sketch} className="w-full mix-blend-darken" alt="sketch"/>
            </div>

            <p className="max-w-4xl text-center text-sm font-mono mb-20">
                Welcome to our garden, the radish platform. You can go ahead and plant a new radish, by
                selecting the
                “Launch Project” button. Once your project is “planted” (launched), investors who take part in
                your
                presale
                can “water your radish” (fund your project). There are two outcomes. If the time is over and the
                softcap
                is
                not reached, your radish has withered (failed) and investors can withdraw back their investment.
                If you
                are
                successful, softcap reached before the funding period is over, your radish is ripe (launch is
                successful).
                You then can harvest you radish (finalize presale). In case you can to cancel your presale you
                can click
                on
                pluck radish. Once you are successful, people can watch the projects they funded and participate
                in the
                DAO
                voting. Currently there are two options, we will expand them as time goes on. Increase duration
                starts a
                vote, to extend to lock period. Withdraw Liquidity, starts a vote to withdraw back the liquidity
                your
                provided. The second vote is only possible if the liquidity is currently not locked.
            </p>
        </div>
    )
}