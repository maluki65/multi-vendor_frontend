import React, { useState } from 'react';
import '../BuyerTabs.css';
import useReviews from '../../../Hooks/useReviews';
import  { getStarts }  from '../../../utils/ratingUtils';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function ReviewSection ({ product }) {
  const { getProductReview , createReview } = useReviews();
  const { data } = getProductReview(product?._id);

  const review = data?.reviews || [];
const total = data?.count || 0;
  const counts = product?.ratingCounts || {}

  console.log('reviews', review);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { full, half, empty } = getStarts(product?.averageRating);

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h2 className='text-2xl font-semibold'>
          {product?.averageRating?.toFixed(1)} out of 5
        </h2>

        <div className='flex items-center gap-1'>
          {[...Array(full)].map((_, i) => <FaStar key={i} className='' />)}
          {half && <FaStarHalfAlt className='' />}
          {[ ...Array(empty)].map((_, i) => <FaRegStar key={i} className='' />)}
        </div>

        <p className='text-sm text-gray-600'>
          {total} reviews
        </p>
      </div>

      <div className='mb-6'>
        {[5,4,3,2,1].map(star => {
          const count = counts?.[star] || 0;
          const percentage = total ? (count / total) * 100 : 0;

          return (
            <div 
              key={star}
              className='flex items-center gap-2'>
                <span className='flex items-center gap-1'>{star} <FaStar className='text-secondary'/></span>

                <div className='w-full bg-gray-200 h-2 rounded'>
                  <div
                    className='bg-secondary h-2 rounded'
                    style={{ width: `${percentage}%`}}
                  />
                </div>

                <span className='' >{count}</span>
            </div>
          );
        })}
      </div>

      <div className='mb-6'>
        <h3 className='font-sembold mb-2'>
          Write a review
        </h3>

        <select
          value={rating}
          required
          onChange={(e) => setRating(Number(e.target.value))}
          className='border p-2 cursor-pointer rounded-md'
          >
            {[5,4,3,2,1].map(n => (
              <option key={n} value={n}>{n} Star</option>
            ))}
          </select>

          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={8}
            required
            placeholder='Write your review...'
            className='w-full mt-2 p-2 outline-none focus:bg-[#dfdede] focus:border-[1.5px] focus:border-orange-500 rounded-lg bg-[#ebe7e7]'
          />

          <button
            onClick={() => {

              /*console.log({
                productId: product._id,
                rating,
                comment
              });*/
              if (!comment.trim()) return;

              createReview.mutate({
                productId: product._id,
                payload: { rating, comment },

                onSuccessCallback: () => {
                  setRating(5);
                  setComment('');
                }
              });
            }}
            className='mt-2 px-4 py-2 bg-primary text-white rounded cursor-pointer'>
              Submit
          </button>
      </div>

      <div className='space-y-4'>
        {review.slice(0,3).map((r) => {
          const starts = getStarts(r.rating);

          return (
            <div 
              key={r._id} 
              className='border p-3 rounded'>
                <div className='flex items-center gap-2'>
                  <img
                    src={r.userId?.buyerProfile?.avatar}
                    className='w-8 h-8 rounded-full'
                  />
                  <span className='font-semibold'>
                    {r.userId?.username}
                  </span>
                </div>

                <div className='flex gap-1 mt-1'>
                  {[...Array(starts.full)].map((_, i) => <FaStar key={i} className='text-secondary' />)}
                  {starts.half && <FaStarHalfAlt className='' />}
                  {[...Array(starts.empty)].map((_, i) => <FaRegStar key={i} className='' />)}
                </div>

                <p className='text-sm mt-2'>{r.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSection