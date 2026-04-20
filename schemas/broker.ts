import { defineField, defineType } from 'sanity';

export const broker = defineType({
  name: 'broker',
  title: 'Sàn đối tác',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tên sàn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Đường dẫn URL',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo sàn',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'affiliateLink',
      title: 'Link affiliate (đăng ký)',
      type: 'url',
    }),
    defineField({
      name: 'tagline',
      title: 'Slogan ngắn',
      type: 'string',
      description: 'Hiện dưới tên sàn trên trang danh sách',
    }),
    defineField({
      name: 'rating',
      title: 'Đánh giá (1–5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'cashbackRate',
      title: 'Mức hoàn tiền',
      type: 'string',
      description: 'VD: $3/lot, 30%/phí',
    }),
    defineField({
      name: 'minDeposit',
      title: 'Nạp tối thiểu',
      type: 'string',
      description: 'VD: $100',
    }),
    defineField({
      name: 'spread',
      title: 'Spread',
      type: 'string',
      description: 'VD: Từ 0.0 pip',
    }),
    defineField({
      name: 'leverage',
      title: 'Đòn bẩy tối đa',
      type: 'string',
      description: 'VD: 1:500',
    }),
    defineField({
      name: 'regulation',
      title: 'Giấy phép / Quản lý',
      type: 'string',
      description: 'VD: ASIC, FCA, CySEC',
    }),
    defineField({
      name: 'pros',
      title: 'Ưu điểm',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'cons',
      title: 'Nhược điểm',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'featured',
      title: 'Nổi bật (hiện lên đầu)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Thứ tự hiển thị',
      type: 'number',
      initialValue: 99,
    }),
    defineField({
      name: 'body',
      title: 'Nội dung review chi tiết',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Mô tả ảnh', type: 'string' },
            { name: 'caption', title: 'Chú thích', type: 'string' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo', rating: 'rating', featured: 'featured' },
    prepare({ title, media, rating, featured }) {
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        media,
        subtitle: rating ? `${'★'.repeat(Math.round(rating))} (${rating}/5)` : 'Chưa có đánh giá',
      };
    },
  },
});
