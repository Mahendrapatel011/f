import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaPen } from 'react-icons/fa';
import { Button, Input, TextArea } from '../common';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Backend integration baad mein
    };

    const handleDiscard = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                        Contact Us
                    </h2>
                    <p className="mt-4 text-base md:text-lg text-gray-500 max-w-sm mx-auto">
                        We're here to answer your questions, support your journey, and hear your 
                        feedback. Reach out — our team is just a message away.
                    </p>
                </div>

                {/* Form Container */}
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            {/* Name Input */}
                            <Input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                icon={<FaUser />}
                                required
                            />

                            {/* Email Input */}
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={<FaEnvelope />}
                                required
                            />

                            {/* Phone Input */}
                            <Input
                                type="tel"
                                name="phone"
                                placeholder="Phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                icon={<FaPhone />}
                                required
                            />

                            {/* Message TextArea */}
                            <TextArea
                                name="message"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                                icon={<FaPen />}
                                rows={4}
                                required
                            />

                            {/* Buttons */}
                            <div className="flex items-center justify-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="md"
                                    onClick={handleDiscard}
                                >
                                    Discard
                                </Button>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    size="md"
                                >
                                    Submit
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ContactSection;