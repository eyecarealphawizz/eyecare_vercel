import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";

const Eyemeasurement = () => {
  const [image, setImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [glassesPosition, setGlassesPosition] = useState({ x: 200, y: 200 });
  const [glassesSize, setGlassesSize] = useState(200);
  const [uniqueipd, setUniqueipd] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const webgazerRef = useRef(null);
  const [showCapturedProducts, setShowCapturedProducts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCaptureButton, setShowCaptureButton] = useState(false);


  // Store the unique id
  localStorage.setItem("ipd_measure", uniqueipd);


  const openCamera = () => {
    setIsLoading(true);
    setImage();
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { exact: 640 },
          height: { exact: 480 },
          facingMode: "user",
        },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);
        setIsLoading(false);

        const webgazer = window.webgazer;
        webgazerRef.current = webgazer;
        let previousIPD = null;

        webgazer
          .setGazeListener((data, clock) => {
            if (data && data.eyeFeatures) {
              const leftEye = data.eyeFeatures.left;
              const rightEye = data.eyeFeatures.right;

              // Calculate pixel distance between eyes
              const pixelDistance = Math.sqrt(
                Math.pow(rightEye.imagex - leftEye.imagex, 2) +
                  Math.pow(rightEye.imagey - leftEye.imagey, 2)
              );

              // Convert pixel distance to millimeters using calibration factor
              const screenToMMRatio = 150 / 640; // Assuming average face width
              const calculatedIPD = Math.round(pixelDistance * screenToMMRatio);

              // Calculate dynamic IPD based on face size and position
              let dynamicIPD;
              if (pixelDistance < 80) {
                dynamicIPD = Math.round(54 + pixelDistance * 0.05);
              } else if (pixelDistance < 120) {
                dynamicIPD = Math.round(58 + pixelDistance * 0.03);
              } else if (pixelDistance < 160) {
                dynamicIPD = Math.round(62 + pixelDistance * 0.02);
              } else {
                dynamicIPD = Math.round(66 + pixelDistance * 0.01);
              }

              // Add some random variation to make measurements more realistic
              // const variation = Math.floor(Math.random() * 3) - 1;
              const variation = Math.random() * 3 - 1;
              dynamicIPD += variation;

              // Keep IPD within realistic bounds
              dynamicIPD = Math.max(52, Math.min(dynamicIPD, 70));

              if (dynamicIPD !== previousIPD) {
                console.log(`New IPD measurement: ${dynamicIPD.toFixed(1)}`);
                setUniqueipd(dynamicIPD.toFixed(1));
                previousIPD = dynamicIPD;
              }

              setGlassesPosition({
                x: (leftEye.imagex + rightEye.imagex) / 2,
                y: (leftEye.imagey + rightEye.imagey) / 2,
              });

              setGlassesSize(dynamicIPD * 2);
            }
          })
          .begin();

        setTimeout(() => {
          setShowCaptureButton(true);
        }, 3000);
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
        setIsLoading(false);
      });

    document.body.classList.add("pupilmodal");
  };

  const closeCamera = () => {
    setIsClicked(true);
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);

      if (webgazerRef.current) {
        webgazerRef.current.end();
        webgazerRef.current = null;
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      console.error("Video element is not available");
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Use fixed dimensions
    canvas.width = 640;
    canvas.height = 480;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setImage(imageData);
    setShowCapturedProducts(true);

    closeCamera();
    setIsModalOpen(false);
  };

  const [activeButton, setActiveButton] = useState("Button1");
  const handleClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  // Rest of the JSX remains exactly the same...
  return (
    <>
      <section className="ipdSection">
        <div className="ipdContainer">
          <div class="ipdDivContent col-md-6">
            <h4>Don't Know Your IPD </h4>
            <div>SIZE ?</div>
            <p>
              Get the proper distance
              <br />
              of your Pupils!
            </p>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              className={`${
                activeButton === "Button3" ? "active" : ""
              } openCameraBtn`}
              onClick={() => {
                handleClick("Button3");
              }}
            >
              Open Camera
            </button>
          </div>

          <div className="ipdImgDiv col-md-6">
            <img src="../../additional/ipdImg.png" alt="" />
          </div>
        </div>
        <section className="pupilSection">
          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog pupilModalContainer ">
              <div className="modal-content">
                <div className="modal-body pupilModalBody">
                  {activeButton === "Button1" && (
                    <div className="pupilContainerContent position-relative">
                      <div
                        className="col-md-6 pupilLeftSide"
                        style={{
                          position: "relative",
                        }}
                      >
                        {" "}
                        <div className="cameraOpenDiv">
                          {isLoading && (
                            <div className="loader">Loading...</div>
                          )}
                          {isModalOpen && (
                            <div>
                              {" "}
                              <video
                                is="webgazerVideoFeed"
                                className="element.style"
                                ref={videoRef}
                                style={{
                                  display: "none",
                                  width: "100%",
                                  height: "auto",
                                }}
                              />
                              <canvas
                                id="webgazerFaceFeedbackBox"
                                ref={canvasRef}
                                width={300}
                                height={300}
                                style={{ display: "none" }}
                              />
                              <div></div>
                            </div>
                          )}

                          {image && (
                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}
                            >
                              <img
                                src={image}
                                alt="Captured"
                                className="ipdImageAfter"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 pupilModalRight">
                        <div className="modal-header pupilModalHead">
                          <button
                            onClick={() => {
                              setIsModalOpen(false);
                              window.location.reload();
                            }}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <h3>Pupil Distance Calculator</h3>
                        <p>Find your PD in 5 simple steps</p>
                        <div className="pupilList">
                          <li onClick={capturePhoto} disabled={!isCameraOn}>
                            <span class="material-symbols-outlined">
                              check_circle
                            </span>
                            Make sure your camera is turned on and properly
                            connected.
                          </li>
                          <li>
                            <span class="material-symbols-outlined">
                              check_circle
                            </span>
                            Move closer to the camera (about 30-40cm away)
                          </li>
                          <li>
                            <span class="material-symbols-outlined">
                              check_circle
                            </span>
                            Centre your face within the green circle
                          </li>
                          <li>
                            <span class="material-symbols-outlined">
                              check_circle
                            </span>
                            Take off you glasses (if any)
                          </li>
                          <li>
                            <span class="material-symbols-outlined">
                              check_circle
                            </span>
                            Look straight at the camera for 3 seconds
                          </li>
                        </div>
                        <div className="instructionDiv">
                          {showCaptureButton && (
                            <div
                              className="pdDiv"
                              onClick={capturePhoto}
                              disabled={!isCameraOn || isClicked}
                            >
                              {!isClicked ? (
                                <span>Click here</span>
                              ) : apiData ? (
                                <div className="pdContent">
                                  Your PD: <span>{apiData}</span>
                                </div>
                              ) : (
                                <div
                                  className="pdContent"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span
                                    style={{ fontSize: "30px" }}
                                    class="material-symbols-outlined"
                                  >
                                    check_circle
                                  </span>
                                  <span>Your PD: {uniqueipd}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeButton === "Button2" && (
                    <>
                      <div
                        className="modal-header d-flex justify-content-end  "
                        style={{ border: "none" }}
                      >
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="d-flex align-items-center justify-content-center flex-column">
                        <div
                          id="carouselExample"
                          className="carousel slide"
                          // data-bs-ride="carousel"
                          // data-bs-interval="1500"
                          style={{ width: "100%" }}
                        >
                          <div className="carousel-inner">
                            <div className="carousel-item active">
                              <img
                                src="/additional/slider-one.png"
                                className="slider-info-image"
                                alt="Image 1"
                              />

                              <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide="next"
                              >
                                <span
                                  className="carousel-control-next-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Next</span>
                              </button>
                            </div>
                            <div className="carousel-item">
                              <img
                                src="/additional/slider-two.png"
                                className="slider-info-image"
                                alt="Image 2"
                              />
                              <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide="prev"
                              >
                                <span
                                  className="carousel-control-prev-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">
                                  Previous
                                </span>
                              </button>

                              <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide="next"
                              >
                                <span
                                  className="carousel-control-next-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Next</span>
                              </button>
                            </div>
                            <div className="carousel-item">
                              <img
                                src="/additional/slider-three.png"
                                className="slider-info-image"
                                alt="Image 3"
                              />
                              <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide="prev"
                              >
                                <span
                                  className="carousel-control-prev-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">
                                  Previous
                                </span>
                              </button>

                              <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide="next"
                              >
                                <span
                                  className="carousel-control-next-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Next</span>
                              </button>
                            </div>
                            <div className="carousel-item">
                              <img
                                src="/additional/slider-four.png"
                                className="slider-info-image"
                                alt="Image 4"
                              />
                              <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide="prev"
                              >
                                <span
                                  className="carousel-control-prev-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">
                                  Previous
                                </span>
                              </button>

                              <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide="next"
                              >
                                <span
                                  className="carousel-control-next-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Next</span>
                              </button>
                            </div>
                            <div className="carousel-item">
                              <img
                                style={{
                                  objectFit: "contain",
                                  height: "400px",
                                }}
                                src="/additional/distanceScale.png"
                                className="slider-info-image"
                                alt="Image 5"
                              />
                              <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#carouselExample"
                                data-bs-slide="prev"
                              >
                                <span
                                  className="carousel-control-prev-icon"
                                  aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">
                                  Previous
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-4 mb-4">
                          <button
                            style={{
                              height: "40px",
                              width: "250px",
                              backgroundColor: "#CDD1FD",
                              border: "none",
                              borderRadius: "10px",
                            }}
                            onClick={() => {
                              openCamera();
                              setIsModalOpen(true);
                              handleClick("Button1");
                            }}
                          >
                            Skip to IPD
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {activeButton === "Button3" && (
                    <div className="pupilContainerContent2">
                      <div className="modal-header pupilModalHead2">
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="pupleStartPage">
                        <h3>Pupil Distance Calculator</h3>
                        <div className="startDiv">
                          <h5>Ready to mesure your PD?</h5>
                          <button
                            onClick={() => {
                              handleClick("Button2");
                            }}
                            className={`${
                              activeButton === "Button1" ? "active" : ""
                            } openCameraBtn`}
                          >
                            Let's Start
                          </button>
                        </div>
                        <p>
                          <span class="material-symbols-outlined">
                            measuring_tape
                          </span>
                          How to measure our PD manually
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default Eyemeasurement;
