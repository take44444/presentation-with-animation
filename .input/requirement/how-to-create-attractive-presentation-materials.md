# How to Create Attractive Presentation Materials

This feature implements presentation which incorporates smooth animations and interactive elements to enhance user engagement and visual appeal.

## Frames

### 1. Title Slide

- When user accesses `/how-to-create-attractive-presentation-materials`, the title slide should be displayed.
- The title slide should include the presentation title, presenter information, and date.
  - Title: 惹きつけるプレゼン資料の作り方
  - Presenter: Takeshi Masumoto
  - Date: 2026-10-03
- When the title slide is displayed, it should display the title, presenter information, and date with smooth animations.
  - The title should appear first, followed by the presenter information and date.
  - Each element should fade in and slide up smoothly.
- After they have appeared, it should show "Scroll" and Lucide `chevron-down` icon with vertical writing.
  - The indicator should fade in smoothly.
  - It should continuously animate with 2 subtle up-and-down motions to draw attention.
    - The animation should use smooth easing functions, such as `ease-in-out`.
  - This indication should be displayed throughout the whole presentation.
    - It should not disappear when transitioning between slides.
    - It should disappear when the presentation ends.
-  When transitioning to the next slide, the title slide should smoothly fade out and slide up.
  -  The transition should use smooth easing functions, such as `ease-in-out`.

### 2. きれいなスライドはセンス？

- When user scrolls to the second slide, it should display the content related to "きれいなスライドはセンス？".
  - The slide should consist of left and right sections.
  - The left section should contain the title of the slide and the explanatory text.
    - The title: きれいなスライドはセンス？
    - The explanatory text in the left section:
      ```
      きれいなスライドはセンスで作ると思っていませんか？
      そんなことはありません。3つのことを抑えるだけで，誰でも分かりやすく魅力的なスライドを作ることができます。
      ```
    - The left section should appear with smooth animations.
      - The left section should fade in and slide up as it appears.
      - The animations should use smooth easing functions, such as `ease-in-out`.
    - When transitioning to the next slide, the left section of the second slide should smoothly fade out and slide up.
      - The transition should use smooth easing functions, such as `ease-in-out`.
  - The right section should contain relevant images or illustrations.
    - The right section should show 2 simplified good slide design examples.
    - The 2 images should overlap and slightly rotate to create a visually appealing layout.
    - The images should have smooth entrance animations.
      - The images should fade in and slightly rotate as they appear.
      - The entrance animations should be staggered, with a slight delay between the two images.
      - The animations should use smooth easing functions, such as `ease-in-out`.
    - After the entrance animations, the images should shake slightly to draw attention.
      - The animation should be subtle and use smooth easing functions, such as `ease-in-out`.
    - Even when transitioning to the next slide, the right section of the second slide should not disappear.
  - The right section should appear after the left section has been displayed.

### 3. シンプルに，キャッチーに，起承転結

- When user scrolls to the third slide, the left section should display the content with smooth animations.
  - The left section should fade in and slide up as it appears.
  - The animations should use smooth easing functions, such as `ease-in-out`.
  - The left section should show just the phrase below, without any additional explanatory text. So the typeface, size, and spacing should be carefully chosen to ensure readability and visual appeal.
    ```
    シンプルに
    キャッチーに
    起承転結
    ```
- The right section should not be updated. It should remain as it was in the previous slide.
- When transitioning to the next slide, the third slide should smoothly fade out and slide up.
  -  The transition should use smooth easing functions, such as `ease-in-out`.

### 4. その他のTips

- When user scrolls to the fourth slide, 6 tips for creating attractive presentation materials should be displayed with smooth animations.
  - The tips should be displayed with smooth animations.
    - Each tip should fade in and zoom in as it appears.
    - The animations should use smooth easing functions, such as `ease-out-elastic`.
    - The animations should be staggered, with a slight delay between each tip to create a cascading effect.
      - The tips should be displayed from top-left to bottom-right, with a slight delay between each tip.
  - Each tip should be displayed with card design.
    - The card design should include a subtle shadow and rounded corners to create a sense of depth and separation from the background.
    - Each card should have title and content sections to clearly present the information.
  - The cards should be aligned in 3 columns and 2 rows.
  - The 6 tips are below:
    - title: 自分の目を肥やす, content: Webサイトやアプリ，ゲーム等，様々なデザインに触れる
    - title: 流行を掴む, content: デザインのベストプラクティスは固定的ではなく，トレンドに応じて変化する
    - title: 与えたい印象から配色を決める, content: スライドで与えたい印象に合わせて配色を選ぶ
    - title: 重要なことだけを書く, content: スライドには本当に伝えたいことだけを記載し，あとは口頭で補足する
    - title: ポイントは3つが丁度良い, content: 人は情報が4つ以上になると記憶しづらくなるため，重要なポイントは3つに絞る
    - title: 示したポイント間で内容を被らせない, content: 内容が重複すると，オーバーに表現しようとしていると見えることがある
- When transitioning to this fourth slide, the scroll indicator should smoothly fade out.
  - The fade out should use smooth easing functions, such as `ease-in-out`.
