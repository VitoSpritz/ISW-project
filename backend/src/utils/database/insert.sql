USE projisw;

INSERT INTO `users` (`username`, `email`, `hashPassword`) VALUES
('Giorgio', 'giorgio.zap@gmail.com', '$2b$10$/my/aCB0L8n/ac2.iAKJW.80wtMa1nHuhS2y2HnGSwLUXJapOtgQW'),
('Luca', 'luca.ros@gmail.com', '$2b$10$UUD2Eyw5mHFNPzfJVz6d7O28YtWy/e5s91J95hof/149GBatCngsy'),
('Vito', 'vito.paolo@gmail.com', '$2b$10$frETDc5wD2oqlySkokHoHehUyJSA6hqRPR/Oi04bbW079XZOot8aS');

INSERT INTO `rooms` (`id`, `roomName`, `roomCreator`) VALUES
(40, 'Pubblica 1 giochi', 'vito.paolo@gmail.com'),
(41, 'Pubblica 1 studio', 'vito.paolo@gmail.com'),
(42, 'Chat cinema', 'giorgio.zap@gmail.com'),
(43, 'Camera di Luca', 'luca.ros@gmail.com');

INSERT INTO `moderators` (`email`, `id`) VALUES
('giorgio.zap@gmail.com', 40),
('giorgio.zap@gmail.com', 42),
('luca.ros@gmail.com', 43),
('vito.paolo@gmail.com', 40),
('vito.paolo@gmail.com', 41);

INSERT INTO `bannedusers` (`email`, `id`, `inizio_sospensione`, `fine_sospensione`) VALUES
('vito.paolo@gmail.com', 43, '2024-02-06 10:48:29', '2024-02-17 10:48:00');