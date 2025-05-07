import React, { useEffect, useState } from 'react';
import "../App.css";

const TermsAndConditions = () => {
  const baseUrl = process.env.REACT_APP_API_URL;

  const [termsContent, setTermsContent] = useState('');

  useEffect(() => {
    // Fetch the terms and conditions from the API
    fetch(`${baseUrl}/api/v1/config`)
      .then((response) => response.json())
      .then((data) => {
        // Access the property using bracket notation due to the ampersand (&)
        setTermsContent(data["terms_&_conditions"]);
      })
      .catch((error) => {
        console.error('Error fetching terms and conditions:', error);
      });
  }, []);

  return (
    <>
      <section className="faqSection">
        <div className="container">
          <h2 className="faqHead">Terms and <span>Conditions</span></h2>
          <div className="policyContentContainer">
            <div className="policyHead">Introduction</div>
            {/* Render the fetched terms content. */}
            <div className="policyContent" dangerouslySetInnerHTML={{ __html: termsContent }} />
          </div>        
        </div>
      </section>
    </>
  );
};

export default TermsAndConditions;
