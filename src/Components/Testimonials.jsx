import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./Testimonials.css";

const Testimonials = () => {
  const options = {
    items: 1,
    margin: 20,
    lazyLoad: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 },
    },
  };

  const testimonials = [
    {
      name: "Nishu Soni",
      role: "FrontEnd Developer",
      image:
        "https://i.postimg.cc/MT4mZbVF/image.png",
      feedback:
        "Being a tech enthusiast, I’m always looking for innovative ways to shop. Tryly is exactly what I’ve been waiting for! The virtual try-on feature is spot on, and it’s really fun to experiment with different outfits. It’s perfect for those who don’t want to spend ages in a fitting room. This app is a must-have for modern shoppers!",
    },
    {
      name: "Yashika",
      role: "AI Engineer",
      image:
        "https://i.postimg.cc/kMLPz06x/image.png",
      feedback:
        "Tryly is a game changer! I’ve always wanted to try on clothes without leaving the comfort of my home, and now I can! The app is super easy to use, and I can see how clothes will fit me before I buy. It’s definitely saved me time and frustration. I’m never going back to traditional shopping!",
    },
    {
      name: "Chahat Gupta",
      role: "AI Engineer",
      image:
        "https://i.postimg.cc/26qntbMF/image.png",
        
      feedback:
        "I absolutely love Tryly! As someone who’s always on the go, I never have time to wait in long lines for trial rooms at stores. This app makes shopping so convenient – I can try on clothes virtually and make quick decisions. Highly recommend it to anyone with a busy schedule!",
    },
    {
      name: "Anaya",
      role: "Customer",
      image:
        "https://i.postimg.cc/76d5hsRz/image.png",
      feedback:
        "Tryly has been a lifesaver for me! As a parent, it’s often a struggle to find time for shopping, especially with kids in tow. Now, I can quickly try on clothes virtually without dragging everyone to the store. It’s so convenient, and I can shop whenever I have a free moment. This app is perfect for anyone who values their time!",
    },
    
  ];

  return (
    <section className="testimonials">
      <div className="container-test">
        <div className="title-test">
          <h5>Testimonials</h5>
          <h2>FROM THE CREATORS</h2>
        </div>
        <OwlCarousel className="owl-theme" {...options}>
          {testimonials.map((testimonial, index) => (
            <div className="item-test" key={index}>
              <div className="profile-test">
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="information">
                  <p className="name">{testimonial.name}</p>
                  <span className="role">{testimonial.role}</span>
                </div>
              </div>
              <p className="feedback">{testimonial.feedback}</p>
              <div className="quote-icon">
                <i className="fa fa-quote-right" aria-hidden="true"></i>
              </div>
            </div>
          ))}
        </OwlCarousel>
      </div>
    </section>
  );
};

export default Testimonials;
