import { useEffect, useState } from "react";
import "../../App.css"


const Offer = () => {
  const [day, setDay] = useState(48);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(58);
  const [second, setSecond] = useState(59);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((prevSecond) => {
        if (prevSecond === 0) {
          if (minute === 0 && hour === 0 && day === 0) {
            clearInterval(interval); // Stop the countdown when it reaches zero
            return 0;
          }

          setMinute((prevMinute) => {
            if (prevMinute === 0) {
              setHour((prevHour) => {
                if (prevHour === 0) {
                  setDay((prevDay) => prevDay - 1);
                  return 23;
                }
                return prevHour - 1;
              });
              return 59;
            }
            return prevMinute - 1;
          });
          return 59;
        }
        return prevSecond - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear the interval when component unmounts
  }, [second, minute, hour, day]);

  return (
    <div className="offer">
      <div className="offer-img">
        <img style={{ width: "100%" }} src="/images/flashshale.web" className="img-fluid" alt="" />
      </div>

      <div className="offer-2">
        <h5>Sale Ends In:</h5>
        <button>{day}d</button>:
        <button>{hour}h</button>:
        <button>{minute}m</button>:
        <button>{second}s</button>
      </div>

<h4 className="offer-h4">Limited-Time Offer: Act Fast! 🔥</h4>
<div className="offer-5">
    <p>Don't miss out on our incredible Limited-Time Offer sale! We've slashed prices on a wide range of products for a brief period, giving you the perfect opportunity to grab those items you've had your eye on. Whether it's the latest fashion trends, cutting-edge electronics, or home essentials, this sale has something for everyone. But remember, time is of the essence – these discounts won't be around for long. So, hurry and fill your cart with fantastic deals while they last. It's the ultimate chance to upgrade your lifestyle without breaking the bank. Shop now and make the most of this exclusive offer before it vanishes!</p>
</div>
    </div>
  );
};

export default Offer;
