import React, { useState, useEffect } from "react";
import "../App.css";

const FAQHelp = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
  
    const fetchFaqData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/config`);
        if (!response.ok) {
          throw new Error("Failed to fetch FAQ data");
        }
        const data = await response.json();
        setFaqData(data.faq); 
      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchFaqData();
  }, []);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div className="loaderbrands my-5"></div>;
  }

  return (
    <section className="faqSection">
      <div className="container">
        <h2 className="faqHead">
          Frequently Asked <span>Questions</span>
        </h2>
        <div className="faqContentContainer">
          <div className="faqItemDiv col-md-7">
            {faqData.map((faq, index) => (
              <div key={faq.id} className="faqItems">
                <div
                  className="faqQuestion"
                  onClick={() => handleToggle(index)}
                >
                  <p>{faq.question}</p>
                  <span>{openIndex === index ? "-" : "+"}</span>
                </div>
                {openIndex === index && (
                  <div className="faqAnswer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="col-md-5 faqImgDiv">
            <img src="../../additional/faqImg.png" alt="FAQ" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQHelp;
