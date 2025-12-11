def send_welcome_email(email: str, full_name: str | None = None) -> None:
    """
    Placeholder email sender.
    Integrate with a real provider (e.g., SendGrid, Postmark) in production.
    """
    recipient = full_name or email
    # In real usage, hand off to an async task / provider SDK
    print(f"[email] Sent welcome email to {recipient}")

