import React, { useEffect, useState } from "react";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { getPricacyPolicyList } from "../redux-components/features/cartSlice";

const PrivacyPolicy = () => {
  const [policyContent, setPolicyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const {privacyPolicyList} = useSelector((state) => state.allCart);
  console.log(privacyPolicyList.privacy_policy,"pricaypolicyList");
  
  const decodeHTML = (html) => {
    console.log(html,"html")
    const doc = new DOMParser().parseFromString(html, "text/html");
    console.log(doc,"doc");
    
    return doc.documentElement.textContent;
  };
  const htmlFormat=decodeHTML(privacyPolicyList.privacy_policy);
  console.log(htmlFormat,'htmlFormat');
  
  useEffect(() => {
    dispatch(getPricacyPolicyList());
    
  }, []);

  return (
    <section className="faqSection">
      <div className="container">
        <h2 className="faqHead">
          Privacy <span>Policy</span>
        </h2>
        <div className="policyContentContainer">
          <div className="policyHead">Introduction</div>

          {/* Render the policy content if available */}
          <div className="policyContent" dangerouslySetInnerHTML={{ __html: privacyPolicyList.privacy_policy }}>
         
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
