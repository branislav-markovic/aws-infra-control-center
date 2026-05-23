# AWS CLI Tool (TypeScript/Node.js)

A simple CLI application built with TypeScript, Node.js and AWS SDK v3 for managing AWS resources from the terminal.

## Features

### EC2
- Launch a new EC2 instance
- List all EC2 instances

### S3
- Create a new S3 bucket

---

# Tech Stack

- TypeScript
- Node.js
- AWS SDK v3

---

# Project Structure

```bash
src/
├── config/
├── factories/
├── interfaces/
├── services/
└── index.ts
```

### Architecture

The project follows a simple layered architecture:

- `index.ts`
  - CLI entry point
  - Handles menu rendering and user input

- `services/`
  - Contains AWS business logic

- `factories/`
  - Responsible for service creation and dependency injection

- `config/`
  - AWS configuration

---

# Prerequisites

- Node.js >= 20
- AWS Account
- Configured AWS credentials

---

# AWS Credentials

Configure credentials using AWS CLI:

```bash
aws configure
```

Or export environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=your_region
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/branislav-markovic/aws-infra-control-center.git
cd <project-name>
```

Install dependencies:

```bash
npm install
```

---

# Configuration

Update AWS configuration inside:

```bash
src/config/aws.config.ts
```

Example:

```ts
export const awsConfig = {
    region: 'eu-central-1',
    amiId: 'ami-xxxxxxxxxxxxx',
};
```

---

# Running the Application

Development mode:

```bash
npm run dev
```

Build project:

```bash
npm run build
```

Run compiled version:

```bash
npm start
```

---

# Example Menu

```bash
AWS CLI Menu:

1. 🚀 Launch new EC2 Instance
2. 📋 List all EC2 Instances
3. 📦 Create new S3 Bucket
```

---

# Example Output

## Launch EC2 Instance

```bash
i-0123456789abcdef0
```

## List EC2 Instances

```bash
i-0123456789abcdef0
i-0fedcba9876543210
```

## Create S3 Bucket

```bash
Bucket "my-bucket" created successfully.
```

---

# Learning Goals

This project was built for practicing:

- TypeScript
- AWS SDK v3
- Dependency Injection
- Factory Pattern
- CLI application architecture
- Clean code principles

---

# License

MIT