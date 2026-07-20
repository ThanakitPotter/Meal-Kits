"use client";

import { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import confetti from "canvas-confetti";

interface ReviewModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({ orderId, isOpen, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setReviewText("");
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("กรุณาให้คะแนนอย่างน้อย 1 ดาว");
    
    setIsSubmitting(true);
    try {
      // 1. ตรวจสอบ User ว่ามีใครล็อกอินอยู่ไหม
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || "guest";
      const userName = user?.name || "Guest User";

      // 2. ส่งรีวิวไปที่ API
      const reviewRes = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userName,
          orderId,
          rating,
          review: reviewText,
        }),
      });

      if (!reviewRes.ok) throw new Error("ส่งรีวิวไม่สำเร็จ");

      // 3. เปลี่ยนสถานะ isReviewed = true ในคำสั่งซื้อ
      const orderRes = await fetch(`/api/orders/${orderId}/reviewed`, {
        method: "PATCH",
      });

      if (!orderRes.ok) throw new Error("อัปเดตสถานะออเดอร์ไม่สำเร็จ");

      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E0A800', '#ffc107', '#ffeb3b', '#4caf50', '#ffffff'],
      });
      
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#E0A800] p-6 text-white text-center relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold">รีวิวอาหารของคุณ</h2>
          <p className="text-sm opacity-90 mt-1">คำสั่งซื้อ #{orderId}</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <svg className="w-12 h-12 text-green-500 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-[#333333] mb-2">ขอบคุณสำหรับการรีวิวครับ! 🎉</h3>
              <p className="text-gray-500 font-medium">ความคิดเห็นของคุณมีความหมายกับเรามาก</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Stars */}
            <div className="flex flex-col items-center">
              <p className="text-[#333333] font-semibold mb-3">คุณพึงพอใจกับมื้อนี้แค่ไหน?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={36} 
                      className={`${
                        (hoverRating || rating) >= star 
                          ? "fill-[#E0A800] text-[#E0A800]" 
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-[#333333]">ความประทับใจหรือข้อเสนอแนะ</span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-28 w-full bg-white text-[#333333] placeholder:text-gray-400 focus:border-[#E0A800] focus:outline-none" 
                placeholder="บอกเราหน่อยว่าคุณชอบเมนูไหน..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={isSubmitting || rating === 0}
              className="btn bg-[#E0A800] hover:bg-[#c98e10] text-white w-full border-none shadow-md text-lg disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isSubmitting ? <span className="loading loading-spinner"></span> : "ส่งรีวิวเลย"}
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
