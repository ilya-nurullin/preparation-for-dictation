# Подготовка к диктанту по английскому языку.

Ссылка: https://ilya-nurullin.github.io/preparation-for-dictation/

Приложение работает по следующему принципу: сначала задаются все возможные вопросы, далее - только те, на которые дан неправильный ответ в предыдущий раз, и так продолжнается до тех пор, пока на все вопросы не будет дан правильный ответ.

Для настройки приложения доступны следующие GET параметры:

`invert=true` - инвертирует задание. Теперь надо искать перевод русского слова.

`answers_count=<int>`- максимальное количество ответов.

`time_to_the_next_question_on_fail=<ms>` - время задержки при переходе к следующему вопросу при неправильном ответе, в миллисекундах.

Пример: https://ilya-nurullin.github.io/preparation-for-dictation/?invert=true&answers_count=3 - получается максимум три ответа, и задание инвертируется.
