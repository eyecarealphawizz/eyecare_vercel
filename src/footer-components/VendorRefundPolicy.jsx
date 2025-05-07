import React, { useEffect, useState } from "react";
import "../App.css"; 

// Helper function to decode HTML entities
const decodeHTML = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.documentElement.textContent;
};

const RefundPolicy = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [refundPolicyContent, setRefundPolicyContent] = useState('');

  useEffect(() => {
    // Fetch the refund policy from the API
    fetch(`${baseUrl}/api/v1/config`)
      .then((response) => response.json())
      .then((data) => {
        // Check if the refund_policy exists and set the decoded content
        if (data?.refund_policy?.status === 1) {
          const decodedContent = decodeHTML(data.refund_policy.content);
          setRefundPolicyContent(decodedContent);
        }
      })
      .catch((error) => {
        console.error('Error fetching refund policy:', error);
      });
  }, []);

  return (
    <section className="faqSection">
      <div className="container">
        <h2 className="faqHead">Refund <span>Policy</span></h2>
        <div className="policyContentContainer">
          <div className="policyHead">Introduction</div>
          {/* Render the decoded refund policy content */}
          <div className="policyContent" dangerouslySetInnerHTML={{ __html: refundPolicyContent }} />
        </div>        
      </div>
    </section>
  );
};

export default RefundPolicy;
