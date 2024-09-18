import React from 'react'
import './Contact.css'
import msg from '../assets/msg.jpg';

const Contact = () => {



  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "380ed754-0035-4e56-972b-7265cd90ea67");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  
  return (
   <div>
    <h1>Get in touch!</h1>
    <div className='contact' >
        <div className="contact-col">
            <h4>Send Us a Message <img src={msg} /></h4>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa neque alias laborum totam autem sint facilis earum
                 fuga repudiandae exercitationem aperiam architecto obcaecati voluptatum quam dolor sapiente omnis, laboriosam illum!</p>
                 <ul>
                    <li><i class='fa fa-envelope'></i>&nbsp;&nbsp;Contact@gmail.com </li>
                    <li><i class="fa fa-phone">&nbsp;&nbsp;0452-009988 </i></li>
                    <li><i class="fa fa-map-marker"></i>&nbsp;&nbsp;Address 77 marcus Ave Cambridge,Delhi</li>
                 </ul>
        </div>
      <div className="contact-col">
      <form onSubmit={onSubmit}>
        <label> Your Name</label>
        <input type="text" name="name" placeholder='Enter your name' required />
        <label> Your Phone number</label>
        <input type="tel" name="phone" placeholder='Enter your phone number' required />
        <label> Write your text</label>
        <textarea  name="message" rows="6" placeholder='Enter your message' required />
        <button type='submit' className='btnn dark'>Submit Now <i class="fa fa-caret-right" style={{fontSize: "24px",marginLeft:"10px"}}></i></button>
      </form>
      <span>{result}</span>
      </div>
    </div>
    </div>
    
    
  )
}

export default Contact
