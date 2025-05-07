import React, { useEffect, useState } from "react";
import "../App.css"; 

const CustomRefundPolicy = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [policyContent, setPolicyContent] = useState(''); 
  // Helper function to decode HTML entities
  const decodeHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent;
  };

  useEffect(() => {
    fetch(`${baseUrl}/api/v1/config`)
      .then((response) => response.json())
      .then((data) => {
        // Check if the return_policy exists and set the decoded content
        if (data?.return_policy?.status === 1) {
          const decodedContent = decodeHTML(data.return_policy.content);
          setPolicyContent(decodedContent);
        }
      })
      .catch((error) => {
        console.error("Error fetching return policy:", error);
      });
  }, []);

  return (
    <>
      <section className="faqSection">
        <div className="container">
          <h2 className="faqHead">
            Customer Return <span>Policy</span>
          </h2>
          <div className="policyContentContainer">
            <div className="policyHead">Introduction</div>
            {/* Render the decoded return policy content */}
            <div
              className="policyContent"
              dangerouslySetInnerHTML={{ __html: policyContent }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomRefundPolicy;
