import { defineField, defineType } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Bài viết',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tiêu đề bài viết',
      type: 'string',
      validation: (Rule) => Rule.required().min(5).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Đường dẫn (tự động tạo)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Tóm tắt (hiện trên trang danh sách)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Danh mục',
      type: 'string',
      options: {
        list: [
          { title: 'Phân tích thị trường',  value: 'Phân tích thị trường' },
          { title: 'Chiến lược giao dịch',  value: 'Chiến lược giao dịch' },
          { title: 'Tư duy đầu tư',         value: 'Tư duy đầu tư' },
          { title: 'Giáo dục tài chính',    value: 'Giáo dục tài chính' },
          { title: 'Tin tức & Cập nhật',    value: 'Tin tức & Cập nhật' },
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Tác giả',
      type: 'string',
      initialValue: 'NEXT 1 Team',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Ngày đăng',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Ảnh bìa',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Mô tả ảnh (Alt)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Nội dung bài viết',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt',     title: 'Mô tả ảnh', type: 'string' },
            { name: 'caption', title: 'Chú thích',  type: 'string' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', date: 'publishedAt', cat: 'category' },
    prepare({ title, media, date, cat }) {
      return {
        title,
        media,
        subtitle: `${cat ?? '—'}  ·  ${date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa đặt ngày'}`,
      };
    },
  },
});
