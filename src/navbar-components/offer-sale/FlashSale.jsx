import { Link } from "react-router-dom";
import "../../App.css";

const FlashSale = () => {
  return (

    <>
      <div className="flash">
        <div className="flashSaleBreadcrumb">
          <h3>Grab The Sale Now !</h3>
          <Link to="/">Back to Home</Link>
        </div>


        <section className="flashSection">
          <div className="container">
          <div className="flashCardContainer">
            <div className="flashCard">
              <Link to="/Offer">
              <div className="flashImg"><img src="/images/flashshale.web" alt="" /></div>
              <div className="flashHead">
                  <h4>Flash Sale</h4>
                  <div className="flashText">Limited : <span>20 Dec 2024</span></div>
                  <div className="flashText">Campaign Status : <span>Ongoing</span></div>
                  <div className="flashText">Offer Till : <span>20 Dec 2024</span></div>
                  <div className="flashText">Deal Rate : <span>4999/-</span></div>
              </div>
            </Link>
            </div>
            <div className="flashCard">
              <Link to="/Offer">
              <div className="flashImg"><img src="/images/flashshale.web" alt="" /></div>
              <div className="flashHead">
                  <h4>Flash Sale</h4>
                  <div className="flashText">Limited : <span>20 Dec 2024</span></div>
                  <div className="flashText">Campaign Status : <span>Ongoing</span></div>
                  <div className="flashText">Offer Till : <span>20 Dec 2024</span></div>
                  <div className="flashText">Deal Rate : <span>4999/-</span></div>
              </div>
              </Link>
            </div>
            <div className="flashCard">
            <Link to="/Offer">
              <div className="flashImg"><img src="/images/flashshale.web" alt="" /></div>
              <div className="flashHead">
                  <h4>Flash Sale</h4>
                  <div className="flashText">Limited : <span>20 Dec 2024</span></div>
                  <div className="flashText">Campaign Status : <span>Ongoing</span></div>
                  <div className="flashText">Offer Till : <span>20 Dec 2024</span></div>
                  <div className="flashText">Deal Rate : <span>4999/-</span></div>
              </div>
              </Link>
            </div>
            <div className="flashCard">
            <Link to="/Offer">
              <div className="flashImg"><img src="/images/flashshale.web" alt="" /></div>
              <div className="flashHead">
                  <h4>Flash Sale</h4>
                  <div className="flashText">Limited : <span>20 Dec 2024</span></div>
                  <div className="flashText">Campaign Status : <span>Ongoing</span></div>
                  <div className="flashText">Offer Till : <span>20 Dec 2024</span></div>
                  <div className="flashText">Deal Rate : <span>4999/-</span></div>
              </div>
              </Link>
            </div>
            <div className="flashCard">
            <Link to="/Offer">
              <div className="flashImg"><img src="/images/flashshale.web" alt="" /></div>
              <div className="flashHead">
                  <h4>Flash Sale</h4>
                  <div className="flashText">Limited : <span>20 Dec 2024</span></div>
                  <div className="flashText">Campaign Status : <span>Ongoing</span></div>
                  <div className="flashText">Offer Till : <span>20 Dec 2024</span></div>
                  <div className="flashText">Deal Rate : <span>4999/-</span></div>
              </div>
              </Link>
            </div>
            <div className="flashCard">
            <Link to="/Offer">
              <div className="flashImg"><img src="/images/flashshale.web" alt="" /></div>
              <div className="flashHead">
                  <h4>Flash Sale</h4>
                  <div className="flashText">Limited : <span>20 Dec 2024</span></div>
                  <div className="flashText">Campaign Status : <span>Ongoing</span></div>
                  <div className="flashText">Offer Till : <span>20 Dec 2024</span></div>
                  <div className="flashText">Deal Rate : <span>4999/-</span></div>
              </div>
              </Link>
            </div>
          </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default FlashSale;
