import { Form, Segment, Image, Header, Icon } from 'semantic-ui-react';
const ImageDrop = ({
	highlighted,
	setHighlighted,
	inputRef,
	handleChange,
	mediaPreview,
	setMediaPreview,
	setMedia,
}) => {
	return (
		<>
			<Form.Field>
				<Segment placeholder basic secondary>
					<input
						type="file"
						name="media"
						id="media"
						accept="image/*"
						onChange={handleChange}
						ref={inputRef}
					/>
					<div
						onDragOver={(e) => {
							e.preventDefault();
							setHighlighted(true);
						}}
						onDragLeave={(e) => {
							e.preventDefault();
							setHighlighted(false);
						}}
						onDrop={(e) => {
							e.preventDefault();
							setHighlighted(true);
							const dropFile = Array.from(e.dataTransfer.files);
							setMedia(dropFile[0]);
							setMediaPreview(URL.createObjectURL(dropFile[0]));
							// console.log(dropFile[0]);
							// console.log(e.dataTransfer.files);
						}}
					>
						{mediaPreview === null ? (
							<>
								<Segment
									color={highlighted ? 'green' : 'red'}
									placeholder
									basic
								>
									<Header icon>
										<Icon
											name="file image outline"
											style={{ cursor: 'pointer' }}
											onClick={() => inputRef.current.click()}
										/>
										Drag n Drop Or Click To Upload Image
									</Header>
								</Segment>
							</>
						) : (
							<>
								<Segment color="green" placeholder basic>
									<Image
										src={mediaPreview}
										size="medium"
										centered
										style={{ cursor: 'pointer' }}
										onClick={() => inputRef.current.click()}
									/>
								</Segment>
							</>
						)}
					</div>
				</Segment>
			</Form.Field>
		</>
	);
};

export default ImageDrop;
